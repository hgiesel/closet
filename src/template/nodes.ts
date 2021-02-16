import type { Filterable } from '../filterManager/filters'
import type { Parser } from './parser'
import type { TagAccessor, TagPath, RoundInfo } from './types'
import type { Delimiters } from './delimiters'
import type { Optic } from "./optics"

import { id } from "../utils"
import { run, dictFunction, dictForget } from './optics'
import { Status } from './types'


export interface ASTNode {
    toString(): string | null
    isReady(): boolean
    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath): ASTNode[]
}

export const nodesAreReady = (accu: boolean, node: ASTNode): boolean => accu && node.isReady()

const joinNodes = (nodes: ASTNode[]) => nodes.map(node => node.toString()).join('')

const leadingTrailingNewlineOrBr = /^(?:<br(?: ?\/)?>|\n)|(?:<br(?: ?\/)?>|\n)$/gu
const stripLineBreaks = (text: string): string => text.replace(leadingTrailingNewlineOrBr, '')

export class TagNode implements ASTNode, Filterable {
    readonly fullKey: string
    readonly key: string
    readonly num: number | null
    readonly fullOccur: number
    readonly occur: number

    readonly delimiters: Delimiters

    protected _inlineNodes: ASTNode[]
    readonly hasInline: boolean
    protected _blockNodes: ASTNode[]
    readonly hasBlock: boolean

    protected _inlineOptics: Optic[] = []
    protected _inlineGetter: Function = id

    protected _blockOptics: Optic[] = []
    protected _blockGetter: Function = id

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
        this.fullKey = fullKey
        this.key = key
        this.num = num
        this.fullOccur = fullOccur
        this.occur = occur
        this.delimiters = delimiters

        this._inlineNodes = inlineNodes
        this.hasInline = hasInline
        this._blockNodes = blockNodes
        this.hasBlock = hasBlock
    }

    /******************** NODES ********************/
    get inlineNodes(): ASTNode[]{
        return this._inlineNodes
    }

    get blockNodes(): ASTNode[]{
        return this._blockNodes
    }

    get innerNodes(): ASTNode[] {
        return this.hasBlock ? this.blockNodes : this.inlineNodes
    }

    protected set internalNodes(nodes: ASTNode[]) {
        if (this.hasBlock) {
            this._blockNodes = nodes
        }
        else {
            this._inlineNodes = nodes
        }
    }

    /******************** TEXT ********************/
    get inlineText(): string {
        return joinNodes(this.inlineNodes)
    }

    get blockText(): string {
        return stripLineBreaks(joinNodes(this.blockNodes))
    }

    get text(): string {
        return this.hasBlock ? this.blockText : this.inlineText
    }

    /******************** OPTICS ********************/
    set inlineOptics(op: Optic[]) {
        this._inlineOptics = op
        this._inlineGetter = run(op, dictForget, id)
    }

    set blockOptics(op: Optic[]) {
        this._blockOptics = op
        this._blockGetter = run(op, dictForget, id)
    }

    set optics(op: Optic[]) {
        if (this.hasBlock) {
            this.blockOptics = op
        }
        else {
            this.inlineOptics = op
        }
    }

    get inlineOptics(): Optic[] {
        return this._inlineOptics
    }

    get blockOptics(): Optic[] {
        return this._blockOptics
    }

    get optics(): Optic[] {
        return this.hasBlock
            ? this.blockOptics
            : this.inlineOptics
    }

    get inlineGetter(): Function {
        return this._inlineGetter
    }

    get blockGetter(): Function {
        return this._blockGetter
    }

    get getter(): Function {
        return this.hasBlock
            ? this.blockGetter
            : this.inlineGetter
    }

    /******************** VALUES ********************/
    get inlineValues() {
        return this.inlineGetter(this.inlineText)
    }

    get blockValues() {
        return this.blockGetter(this.blockText)
    }

    get values() {
        return this.hasBlock ? this.blockValues : this.inlineValues
    }

    /******************** TRAVERSE ********************/
    inlineTraverse(f: (x: unknown) => unknown) {
        return run(this.inlineOptics, dictFunction, f)(this.inlineText)
    }

    blockTraverse(f: (x: unknown) => unknown) {
        return run(this.blockOptics, dictFunction, f)(this.blockText)
    }

    traverse(f: (x: unknown) => unknown) {
        return this.hasBlock ? this.blockTraverse(f) : this.inlineTraverse(f)
    }

    /******************** REPRESENTATION ********************/
    toString(): string {
        return this.hasInline
            ? this.hasBlock
                ? `${this.delimiters.open}#${this.fullKey}${this.delimiters.sep}${this.inlineText}${this.delimiters.close}${this.blockText}${this.delimiters.open}/${this.fullKey}{${this.delimiters.close}`
                : `${this.delimiters.open}${this.fullKey}${this.delimiters.sep}${this.inlineText}${this.delimiters.close}`
            : this.hasBlock
                ? `${this.delimiters.open}#${this.fullKey}${this.delimiters.close}${this.blockText}${this.delimiters.open}/${this.fullKey}${this.delimiters.close}`
                : `${this.delimiters.open}${this.fullKey}${this.delimiters.close}`
    }

    get representation(): string {
        return this.toString()
    }

    isReady(): boolean {
        return false
    }

    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath, allowCapture = true): ASTNode[] {
        const tagProcessor = tagAccessor(this.key)
        const depth = tagPath.length - 1

        const useCapture = tagProcessor.getOptions().capture && allowCapture

        const innerEvaluate = (node: ASTNode, index: number) => node.evaluate(
            parser,
            tagAccessor,
            [...tagPath, index],
        )

        if (!useCapture) {
            this.innerNodes.splice(
                0,
                this.innerNodes.length,
                ...this.innerNodes.flatMap(innerEvaluate),
            )
        }

        const allReady = this.innerNodes.reduce(nodesAreReady, true)
        this.optics = tagProcessor.getOptions().optics

        const roundInfo: RoundInfo = {
            path: tagPath,
            depth: depth,
            ready: allReady,
            isCapture: useCapture,
        }

        const filterOutput = tagProcessor.execute(this, roundInfo)
        let result

        switch (filterOutput.status) {
            case Status.Ready:
                result = typeof filterOutput.result === "string"
                    ? [new TextNode(filterOutput.result as string)]
                    : filterOutput.result as unknown as ASTNode[]
                break
            case Status.NotReady:
                result = useCapture
                    ? this.innerNodes
                    : [this]
                break
            case Status.ContinueTags:
                result = parser.rawParse(filterOutput.result as string).flatMap(innerEvaluate)
                break
            case Status.ContainsTags:
                result = parser.rawParse(filterOutput.result as string)
                break
        }

        if (useCapture) {
            this.internalNodes = result
            return this.evaluate(parser, tagAccessor, tagPath, false)
        }

        return result
    }
}

export class TextNode implements ASTNode {
    readonly text: string

    constructor(
        text: string,
    ) {
        this.text = text
    }

    toString(): string | null {
        return this.text
    }

    isReady(): boolean {
        // should never happen
        return true
    }

    evaluate(): ASTNode[] {
        return [this]
    }
}

export class DocSeparatorNode implements ASTNode {
    toString(): string | null {
        return null
    }

    isReady(): boolean {
        // should never happen
        return true
    }

    evaluate(): ASTNode[] {
        return [this]
    }
}
