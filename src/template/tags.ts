import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

import type { TagPath } from '.'
import type { Parser } from './parser'

import { Filterable } from '../filterManager/filters'

/////

export interface Separator {
    sep: string
    max: number
    trim: boolean
}

export type WeakSeparator = Partial<Separator> | string

const splitValues = (text: string, seps: Separator[]): any => {
    if (seps.length === 0) {
        return text
    }

    const [{ sep, max, trim }, ...nextSeps] = seps

    let textSplit = text

    const splits = []

    for (let i = 1; textSplit.length !== 0 && i < max; i++) {
        const pos = textSplit.indexOf(sep)
        const [ currentSplit, rest ] = pos >= 0
            ? [textSplit.slice(0, pos), textSplit.slice(pos + sep.length)]
            : [textSplit, '']

        splits.push(trim ? currentSplit.trim() : currentSplit)
        textSplit = rest
    }

    if (textSplit.length !== 0) {
        splits.push(textSplit)
    }

    return nextSeps.length === 0
        ? splits
        : splits.map(v => splitValues(v, nextSeps))
}

const weakSeparatorToSeparator = (v: WeakSeparator): Separator => typeof v === 'string'
    ? { sep: v, max: Infinity, trim: false }
    : { sep: v.sep ?? '::', max: v.max ?? Infinity, trim: v.trim ?? false }

/////



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

export const nodesAreReady = (accu: boolean, node: ASTNode): boolean => accu && node.isReady()

/////////

export interface ASTNode {
    toString(): string | null
    isReady(): boolean
    evaluate(parser: Parser, tagAccessor: TagAccessor, tagPath: TagPath): ASTNode
}

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
        const newNodes = useCapture
            ? this.innerNodes
            : this.innerNodes.map((node, index) => node.evaluate(parser, tagAccessor, [...tagPath, index]))

        const allReady = newNodes.reduce(nodesAreReady, true)
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
