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

export class TagNode implements ASTNode, Filterable {
    readonly fullKey: string
    readonly key: string
    readonly num: number | null
    readonly fullOccur: number
    readonly occur: number
    readonly abbreviated: boolean

    readonly delimiters: Delimiters

    protected _innerNodes: ASTNode[]

    protected _optics: Optic[] = []
    protected _getter: Function = id

    constructor(
        fullKey: string,
        key: string,
        num: number | null,
        fullOccur: number,
        occur: number,
        abbreviated: boolean,
        delimiters: Delimiters,
        innerNodes: ASTNode[],
    ) {
        this.fullKey = fullKey
        this.key = key
        this.num = num
        this.fullOccur = fullOccur
        this.occur = occur
        this.delimiters = delimiters
        this.abbreviated = abbreviated

        this._innerNodes = innerNodes
    }

    get representation() {
        return this.toString()
    }

    get innerNodes() {
        return this._innerNodes
    }

    get valuesText(): string {
        return this.innerNodes.map(node => node.toString()).join('')
    }

    get values() {
        return this._getter(this.valuesText)
    }

    traverse(f: (x: unknown) => unknown) {
        return run(this.optics, dictFunction, f)(this.valuesText)
    }

    set optics(o: Optic[]) {
        this._optics = o
        this._getter = run(this._optics, dictForget, id)
    }

    toString(): string {
        return this.abbreviated
            ? `${this.delimiters.open}${this.fullKey}${this.delimiters.close}`
            : `${this.delimiters.open}${this.fullKey}${this.delimiters.sep}${this.valuesText}${this.delimiters.close}`
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
            this._innerNodes = result
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
