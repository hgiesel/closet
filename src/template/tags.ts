import type { TagPath } from '.'
import type { Separator, WeakSeparator } from './separator'
import type { Parser } from './parser'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

import { Filterable } from '../filterManager/filters'
import { splitValues, weakSeparatorToSeparator } from './separator'

export interface RoundInfo {
    path: number[]
    depth: number
    ready: boolean
    capture: boolean
}

export enum Status {
    Ready,
    NotReady,
    ContainsTags,
}

export interface ProcessorOutput {
    result: string | null
    status: Status
}

export interface DataOptions {
    separators: Array<string | Partial<Separator>>
    capture: boolean
}

export type TagAccessor = (name: string) => TagProcessor

export interface TagProcessor {
    execute: (data: TagNode, round: RoundInfo) => ProcessorOutput
    getOptions: () => DataOptions
}

/////////

export interface ASTNode {
    toString(): string | null
    isReady(): boolean
    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath): ASTNode
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

    isReady() {
        return false
    }

    getDefaultRepresentation() {
        return this.toString()
    }

    getRawRepresentation() {
        return this.valuesText
    }

    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath): ASTNode {
        const tagProcessor = tagAccessor(this.key)
        const depth = tagPath.length

        const useCapture = tagProcessor.getOptions().capture

        if (!useCapture) {
            this.innerNodes.splice(
                0,
                this.innerNodes.length,
                ...this.innerNodes.map((node, index) => node.evaluate(
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
                return this
            case Status.Ready:
                return new TextNode(filterOutput.result as string)
            case Status.ContainsTags:
                this.innerNodes.splice(0, this.innerNodes.length, ...parser.rawParse(filterOutput.result as string))
                return this
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

    toString() {
        return this.text
    }

    isReady() {
        // should never happen
        return true
    }

    evaluate() {
        return this
    }
}

export class DocSeparatorNode implements ASTNode {
    toString() {
        return null
    }

    isReady() {
        // should never happen
        return true
    }

    evaluate() {
        return this
    }
}
