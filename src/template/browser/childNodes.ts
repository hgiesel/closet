export type BrowserTemplateNode = Element | Text | ChildNodeSpan | string;

// negative result implies invalid idx
const parseIndexArgument = (idx: number, min: number, max: number): number => {
    return idx < 0 ? max + idx + 1 : min + idx;
};

export const getText = (
    input: BrowserTemplateNode,
    takeOuter: boolean,
): string => {
    if (typeof input === "string") {
        return input;
    }

    let textNode = null,
        elementNode = null,
        span = null;

    switch (input.nodeType) {
        case Node.TEXT_NODE:
            textNode = input as Text;
            return textNode.textContent ?? "";

        case Node.ELEMENT_NODE:
            elementNode = input as Element;
            return takeOuter ? elementNode.outerHTML : elementNode.innerHTML;

        case ChildNodeSpan.CHILD_NODE_SPAN:
            span = input as ChildNodeSpan;
            return span.spanAsStrings().join("");

        default:
            return "";
    }
};

export const setText = (input: BrowserTemplateNode, newText: string): void => {
    if (typeof input === "string") {
        return;
    }

    let textNode = null,
        placeholderNode = null,
        elementNode = null,
        span = null;

    switch (input.nodeType) {
        case Node.TEXT_NODE:
            textNode = input as Text;
            placeholderNode = document.createElement("div");

            if (textNode.parentElement) {
                textNode.parentElement.insertBefore(placeholderNode, textNode);
                textNode.parentElement.removeChild(textNode);
            }

            placeholderNode.outerHTML = newText;
            break;

        case Node.ELEMENT_NODE:
            elementNode = input as Element;
            elementNode.innerHTML = newText;
            break;

        case ChildNodeSpan.CHILD_NODE_SPAN:
            span = input as ChildNodeSpan;
            span.replaceSpan(newText);
            break;
    }
};

interface ChildNodeIndex {
    type: "index";
    value: number;
    exclusive?: boolean;
    startAtIndex?: number;
}

interface ChildNodeNode {
    type: "node";
    value: BrowserTemplateNode;
    exclusive?: boolean;
    startAtIndex?: number;
}

export interface ChildNodePredicate {
    type: "predicate";
    value: (v: BrowserTemplateNode) => boolean;
    exclusive?: boolean;
    startAtIndex?: number;
}

type ChildNodePosition = ChildNodeIndex | ChildNodeNode | ChildNodePredicate;

const defaultFromValue: ChildNodeIndex = {
    type: "index",
    value: 0,
};

const defaultToValue: ChildNodeIndex = {
    type: "index",
    value: -1,
};

export class ChildNodeSpan {
    static readonly CHILD_NODE_SPAN = 3353; /* this number is arbitrary */
    readonly nodeType = ChildNodeSpan.CHILD_NODE_SPAN;

    private readonly parentElement: Element;
    private childNodes: ChildNode[];
    private max: number;

    private _fromIndex: number;
    private _toIndex: number;

    constructor(
        parentElement: Element,
        fromValue: ChildNodePosition = defaultFromValue,
        toValue: ChildNodePosition = defaultToValue,
    ) {
        this.parentElement = parentElement;
        this.childNodes = Array.from(this.parentElement.childNodes);

        this.max = parentElement.childNodes.length - 1;

        const fromFunc = this.getFromMethod(fromValue.type) as any;
        const toFunc = this.getToMethod(toValue.type) as any;

        this._fromIndex = fromFunc.call(
            this as ChildNodeSpan,
            fromValue.value as any,
            fromValue.startAtIndex ?? 0,
            fromValue.exclusive ?? false,
        );

        this._toIndex = toFunc.call(
            this as ChildNodeSpan,
            toValue.value as any,
            Math.max(toValue.startAtIndex ?? 0, this.from),
            toValue.exclusive ?? false,
        );
    }

    get from(): number {
        return this._fromIndex;
    }

    get to(): number {
        return this._toIndex;
    }

    private getFromMethod(name: string) {
        return name === "index"
            ? this.fromIndex
            : name === "node"
            ? this.fromNode
            : this.fromPredicate;
    }

    private getToMethod(name: string) {
        return name === "index"
            ? this.toIndex
            : name === "node"
            ? this.toNode
            : this.toPredicate;
    }

    private fromSafe(i: number, min: number): number {
        return i < min || i > this.max ? this.max : i;
    }

    private fromIndex(i: number, min: number, exclusive: boolean): number {
        const parsed =
            parseIndexArgument(i, min, this.max) + (exclusive ? 1 : 0);
        return this.fromSafe(parsed, min);
    }

    private fromNode(node: Node, min: number, exclusive: boolean): number {
        const found =
            this.childNodes
                .slice(min)
                .findIndex((v: ChildNode): boolean => v === node) +
            min +
            (exclusive ? 1 : 0);
        return this.fromSafe(found, min);
    }

    private fromPredicate(
        pred: (v: Node) => boolean,
        min: number,
        exclusive: boolean,
    ): number {
        const found =
            this.childNodes.slice(min).findIndex(pred) +
            min +
            (exclusive ? 1 : 0);
        return this.fromSafe(found, min);
    }

    private toSafe(i: number, min: number): number {
        return i < min || i > this.max ? 0 : i;
    }

    private toIndex(i: number, min: number, exclusive: boolean): number {
        const parsed =
            parseIndexArgument(i, min, this.max) - (exclusive ? 1 : 0);
        return this.toSafe(parsed, min);
    }

    private toNode(node: Node, min: number, exclusive: boolean): number {
        const found =
            this.childNodes
                .slice(min)
                .findIndex((v: ChildNode): boolean => v === node) +
            min -
            (exclusive ? 1 : 0);
        return this.toSafe(found, min);
    }

    private toPredicate(
        pred: (v: Node) => boolean,
        min: number,
        exclusive: boolean,
    ): number {
        const found =
            this.childNodes.slice(min).findIndex(pred) +
            min -
            (exclusive ? 1 : 0);
        return this.toSafe(found, min);
    }

    get valid(): boolean {
        return this._fromIndex <= this._toIndex;
    }

    get length(): number {
        return Math.max(0, this._toIndex - this._fromIndex + 1);
    }

    getRootNode(): Node {
        return this.parentElement.getRootNode();
    }

    span(): ChildNode[] {
        return this.valid
            ? this.childNodes.slice(this._fromIndex, this._toIndex + 1)
            : [];
    }

    spanAsStrings(): string[] {
        return this.span().map((elem) => getText(elem as Element, true));
    }

    replaceSpan(newText: string): void {
        if (!this.valid) {
            return;
        }

        const placeholderNode = document.createElement("div");
        const oldLength = this.parentElement.childNodes.length;

        this.parentElement.insertBefore(
            placeholderNode,
            this.parentElement.childNodes[this._fromIndex],
        );
        for (const node of this.span()) {
            if (node.parentElement === this.parentElement) {
                this.parentElement.removeChild(node);
            }
        }

        // might turn the original div into multiple nodes including text nodes
        placeholderNode.outerHTML = newText;

        // reset childNode information
        this.childNodes = Array.from(this.parentElement.childNodes);
        this.max = this.childNodes.length;

        this._toIndex = this._toIndex + (this.max - oldLength);
    }
}
