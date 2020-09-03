import type { Filterable } from '../filterManager/filters'
import type { Separator, WeakSeparator } from './separator'
import type { Parser } from './parser'
import type { TagAccessor, TagPath, RoundInfo } from './types'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

import { splitValues, weakSeparatorToSeparator } from './separator'
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
    readonly innerNodes: ASTNode[]

    protected _separators: Separator[] = []

    constructor(
        fullKey: string,
        key: string,
        num: number | null,
        fullOccur: number,
        occur: number,
        innerNodes: ASTNode[],
    ) {
        this.fullKey = fullKey
        this.key = key
        this.num = num
        this.fullOccur = fullOccur
        this.occur = occur

        this.innerNodes = innerNodes
    }

    get representation() {
        return this.toString()
    }

    get valuesText(): string {
        return this.innerNodes.map(node => node.toString()).join('')
    }

    get values() {
        return splitValues(this.valuesText, this._separators)
    }

    set separators(seps: WeakSeparator[]) {
        this._separators = seps.map(weakSeparatorToSeparator)
    }

    get separator(): Separator[] {
        return this.separators as Separator[]
    }

    toString(): string {
        return `${TAG_OPEN}${this.fullKey}${ARG_SEP}${this.valuesText}${TAG_CLOSE}`
    }

    isReady(): boolean {
        return false
    }

    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath): ASTNode[] {
        const tagProcessor = tagAccessor(this.key)
        const depth = tagPath.length - 1

        const useCapture = tagProcessor.getOptions().capture

        if (!useCapture) {
            this.innerNodes.splice(
                0,
                this.innerNodes.length,
                ...this.innerNodes.flatMap((node: ASTNode, index: number) => node.evaluate(
                    parser,
                    tagAccessor,
                    [...tagPath, index],
                )),
            )
        }

        const allReady = this.innerNodes.reduce(nodesAreReady, true)
        this.separators = tagProcessor.getOptions().separators

        const roundInfo: RoundInfo = {
            path: tagPath,
            depth: depth,
            ready: allReady,
            capture: useCapture,
        }

        const filterOutput = tagProcessor.execute(this, roundInfo)

        switch (filterOutput.status) {
            case Status.NotReady:
                return [this]
            case Status.Ready:
                return [new TextNode(filterOutput.result as string)]
            case Status.ContainsTags:
                return parser.rawParse(filterOutput.result as string)
        }
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
