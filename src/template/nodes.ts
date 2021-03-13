import type { Filterable } from "../filterManager/filters";
import type { Parser } from "./parser";
import type { TagAccessor, TagPath, RoundInfo } from "./types";
import type { Delimiters } from "./delimiters";
import type { Optic } from "./optics";

import { id } from "../utils";
import { run, dictFunction, dictForget } from "./optics";
import { Status } from "./types";

export interface ASTNode extends Filterable {
    toString(): string | null;
    isReady(): boolean;
    evaluate(
        parser: Parser,
        tagAccessor: TagAccessor,
        tagPath: TagPath,
    ): ASTNode[];
}

export const nodesAreReady = (accu: boolean, node: ASTNode): boolean =>
    accu && node.isReady();

const joinNodes = (nodes: ASTNode[]) =>
    nodes.map((node) => node.toString()).join("");
const joinRepr = (nodes: ASTNode[]) =>
    nodes.map((node) => node.toReprString()).join("");

const leadingTrailingNewlineOrBr = /^(?:<br(?: ?\/)?>|\n)|(?:<br(?: ?\/)?>|\n)$/gu;
const stripLineBreaks = (text: string): string =>
    text.replace(leadingTrailingNewlineOrBr, "");

export class TagNode implements ASTNode {
    readonly fullKey: string;
    readonly key: string;
    readonly num: number | null;
    readonly fullOccur: number;
    readonly occur: number;

    readonly delimiters: Delimiters;

    protected _inlineNodes: ASTNode[];
    readonly hasInline: boolean;
    protected _blockNodes: ASTNode[];
    readonly hasBlock: boolean;

    protected _inlineOptics: Optic[] = [];
    protected _inlineGetter: (i: any) => any = id;

    protected _blockOptics: Optic[] = [];
    protected _blockGetter: (i: any) => any = id;

    constructor(
        fullKey: string,
        key: string,
        num: number | null,
        fullOccur: number,
        occur: number,
        delimiters: Delimiters,
        inlineNodes: ASTNode[],
        hasInline: boolean,
        blockNodes: ASTNode[],
        hasBlock: boolean,
    ) {
        this.fullKey = fullKey;
        this.key = key;
        this.num = num;
        this.fullOccur = fullOccur;
        this.occur = occur;
        this.delimiters = delimiters;

        this._inlineNodes = inlineNodes;
        this.hasInline = hasInline;
        this._blockNodes = blockNodes;
        this.hasBlock = hasBlock;
    }

    /******************** NODES ********************/
    get inlineNodes(): ASTNode[] {
        return this._inlineNodes;
    }

    get blockNodes(): ASTNode[] {
        return this._blockNodes;
    }

    get innerNodes(): ASTNode[] {
        return this.hasBlock ? this.blockNodes : this.inlineNodes;
    }

    protected set internalNodes(nodes: ASTNode[]) {
        if (this.hasBlock) {
            this._blockNodes = nodes;
        } else {
            this._inlineNodes = nodes;
        }
    }

    /******************** TEXT ********************/
    get inlineText(): string {
        return joinNodes(this.inlineNodes);
    }

    get blockText(): string {
        return stripLineBreaks(joinNodes(this.blockNodes));
    }

    get text(): string {
        return this.hasBlock ? this.blockText : this.inlineText;
    }

    /******************** OPTICS ********************/
    set inlineOptics(op: Optic[]) {
        this._inlineOptics = op;
        this._inlineGetter = run(op, dictForget, id);
    }

    get inlineOptics(): Optic[] {
        return this._inlineOptics;
    }

    set blockOptics(op: Optic[]) {
        this._blockOptics = op;
        this._blockGetter = run(op, dictForget, id);
    }

    get blockOptics(): Optic[] {
        return this._blockOptics;
    }

    set optics(op: Optic[]) {
        if (this.hasBlock) {
            this.blockOptics = op;
        } else {
            this.inlineOptics = op;
        }
    }

    get optics(): Optic[] {
        return this.hasBlock ? this.blockOptics : this.inlineOptics;
    }

    get inlineGetter(): (i: any) => any {
        return this._inlineGetter;
    }

    get blockGetter(): (i: any) => any {
        return this._blockGetter;
    }

    get getter(): (i: any) => any {
        return this.hasBlock ? this.blockGetter : this.inlineGetter;
    }

    /******************** VALUES ********************/
    get inlineValues() {
        return this.inlineGetter(this.inlineText);
    }

    get blockValues() {
        return this.blockGetter(this.blockText);
    }

    get values() {
        return this.hasBlock ? this.blockValues : this.inlineValues;
    }

    /******************** TRAVERSE ********************/
    inlineTraverse(f: (x: unknown) => unknown) {
        return run(this.inlineOptics, dictFunction, f)(this.inlineText);
    }

    blockTraverse(f: (x: unknown) => unknown) {
        return run(this.blockOptics, dictFunction, f)(this.blockText);
    }

    traverse(f: (x: unknown) => unknown) {
        return this.hasBlock ? this.blockTraverse(f) : this.inlineTraverse(f);
    }

    /******************** STRINGIFY ********************/
    // implementation detail
    protected wrapWithDelimiters(infix: string, wrapped?: string): string {
        return `${this.delimiters.open}${infix}${this.fullKey}${
            wrapped ? this.delimiters.sep + wrapped : ""
        }${this.delimiters.close}`;
    }

    protected wrapBlock(block: string, inline?: string): string {
        return `${this.wrapWithDelimiters(
            "#",
            inline,
        )}${block}${this.wrapWithDelimiters("/")}`;
    }

    protected baseToString(
        getInline: () => string,
        getBlock: () => string,
    ): string {
        return this.hasInline
            ? this.hasBlock
                ? this.wrapBlock(getBlock(), getInline())
                : this.wrapWithDelimiters("", getInline())
            : this.hasBlock
            ? this.wrapBlock(getBlock())
            : this.wrapWithDelimiters("");
    }

    toString(): string {
        return this.baseToString(
            () => this.inlineText,
            () => this.blockText,
        );
    }

    toReprString(): string {
        return this.baseToString(
            () => joinRepr(this.inlineNodes),
            () => joinRepr(this.blockNodes),
        );
    }

    isReady(): boolean {
        return false;
    }

    evaluate(
        parser: Parser,
        tagAccessor: TagAccessor,
        tagPath: TagPath,
        afterCapture = false,
    ): ASTNode[] {
        const tagProcessor = tagAccessor(this.key);
        const depth = tagPath.length - 1;

        const useCapture = tagProcessor.getOptions().capture;

        const innerEvaluate = (node: ASTNode, index: number) =>
            node.evaluate(parser, tagAccessor, [...tagPath, index]);

        const shouldEvaluateInnerNodes = !useCapture && !afterCapture;
        const operatesAsCapture = useCapture && !afterCapture;

        if (shouldEvaluateInnerNodes) {
            this.innerNodes.splice(
                0,
                this.innerNodes.length,
                ...this.innerNodes.flatMap(innerEvaluate),
            );
        }

        const allReady = this.innerNodes.reduce(nodesAreReady, true);

        this.inlineOptics = tagProcessor.getOptions().inlineOptics;
        this.blockOptics = tagProcessor.getOptions().blockOptics;

        const roundInfo: RoundInfo = {
            path: tagPath,
            depth: depth,
            ready: allReady,
            isCapture: operatesAsCapture,
        };

        const filterOutput = tagProcessor.execute(this, roundInfo);
        let result;

        switch (filterOutput.status) {
            case Status.Ready:
                result =
                    typeof filterOutput.result === "string"
                        ? [new TextNode(filterOutput.result as string)]
                        : ((filterOutput.result as unknown) as ASTNode[]);
                break;
            case Status.NotReady:
                result = operatesAsCapture ? this.innerNodes : [this];
                break;
            case Status.ContinueTags:
                result = parser
                    .rawParse(filterOutput.result as string)
                    .flatMap(innerEvaluate);
                break;
            case Status.ContainsTags:
                result = parser.rawParse(filterOutput.result as string);
                break;
        }

        if (operatesAsCapture) {
            this.internalNodes = result;
            return this.evaluate(parser, tagAccessor, tagPath, true);
        }

        return result;
    }
}

class SimpleNode implements ASTNode {
    isReady(): boolean {
        // should never happen
        return true;
    }

    evaluate(): ASTNode[] {
        return [this];
    }

    toReprString(): string {
        return this.toString() ?? "";
    }
}

export class TextNode extends SimpleNode {
    readonly text: string;

    constructor(text: string) {
        super();
        this.text = text;
    }

    toString(): string | null {
        return this.text;
    }
}

export class EscapedNode extends SimpleNode {
    readonly escaped: string;

    constructor(escaped: string) {
        super();
        this.escaped = escaped;
    }

    toString(): string | null {
        return this.escaped.length === 1 ? this.escaped : this.escaped.slice(1);
    }

    toReprString(): string {
        return this.escaped;
    }
}

export class DocSeparatorNode extends SimpleNode {
    toString(): string | null {
        return null;
    }
}
