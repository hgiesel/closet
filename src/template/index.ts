import type { ASTNode, TagInfo, TagData } from './tags'
import type { TagAccessor } from './evaluate'

import { Parser } from './parser'
import { evaluateTemplate } from './evaluate'

export interface TemplateInfo {
    template: Template
    parser: Parser
}

export interface IterationInfo {
    iteration: number
    baseDepth: number
}

export interface ResultInfo {
    result: string | string[]
}

// TagRenderer -> TagAcessor -> TagProcessor
export interface TagRenderer {
    makeAccessor: (t: TemplateInfo, i: IterationInfo) => TagAccessor
    finishIteration: (t: TemplateInfo, i: IterationInfo) => void
    finishRun: (t: TemplateInfo, x: ResultInfo) => void
}

export type TagPath = number[]

const MAX_ITERATIONS = 50

const splitTextFromIntervals = (text: string, intervals: [number, number][]): string[] => {
    const result: string[] = []

    for (const [ivlStart, ivlEnd] of intervals) {
        result.push(text.slice(ivlStart, ivlEnd))
    }

    return result
}



export class Template {
    readonly textFragments: string[]
    readonly parser: Parser

    readonly nodes: ASTNode[]

    protected constructor(fragments: string[], preparsed: ASTNode[] | null) {
        this.textFragments = fragments
        this.parser = new Parser()

        this.nodes = preparsed ?? this.parser.parse(fragments)
    }

    static make(text: string) {
        return new Template([text], null)
    }

    static makeFromFragments(texts: string[]) {
        return new Template(texts, null)
    }

    render(tagRenderer: TagRenderer, cb?: (t: string[]) => void) {
        let ready = false
        let text = this.textFragments.join('')
        let baseStack: [number, number][] = []

        const templateInfo: TemplateInfo = {
            template: this,
            parser: this.parser,
        }

        for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
            console.groupCollapsed(`Iteration ${i}`)
            const iterationInfo: IterationInfo = {
                iteration: i,
                baseDepth: 0,
            }


            const [
                newText,
                /* finalOffset */,
                newReady,
                newBaseStack,
            ] = ['', 5, false, []]/* evaluateTemplate(
                text,
                this.nodes,
                this.baseDepth,
                tagRenderer.makeAccessor(templateInfo, iterationInfo),
                this.parser,
            )*/

            text = newText
            ready = newReady
            baseStack = newBaseStack

            tagRenderer.finishIteration(templateInfo, iterationInfo)
            console.groupEnd()
        }

        const result = splitTextFromIntervals(text, baseStack)

        if (cb) {
            cb(result)
        }

        tagRenderer.finishRun(templateInfo, { result: result })

        return result
    }
}
