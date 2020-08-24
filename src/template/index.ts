import type { ASTNode } from './tags'
import type { TagAccessor } from './types'

import { nodesAreReady } from './tags'
import { Parser } from './parser'


export interface TemplateInfo {
    template: Template
    parser: Parser
}

export interface IterationInfo {
    iteration: number
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

const MAX_ITERATIONS = 50

const stringifyNodes = (nodes: ASTNode[]): string[] => {
    const result = []
    let currentString = ''

    for (const node of nodes) {
        const stringified = node.toString()

        if (typeof stringified === 'string') {
            currentString += stringified
        }

        else {
            result.push(currentString)
            currentString = ''
        }
    }

    result.push(currentString)

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

    render(tagRenderer: TagRenderer, cb?: (t: string[]) => void): string[] {
        const templateInfo: TemplateInfo = {
            template: this,
            parser: this.parser,
        }

        let nodes = this.nodes
        let ready = false

        for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
            console.groupCollapsed(`Iteration ${i}`)
            const iterationInfo: IterationInfo = {
                iteration: i,
            }

            const tagAccessor = tagRenderer.makeAccessor(templateInfo, iterationInfo)

            nodes = nodes.map((node, index) => node.evaluate(this.parser, tagAccessor, [index]))
            ready = nodes.reduce(nodesAreReady, true)

            tagRenderer.finishIteration(templateInfo, iterationInfo)
            console.groupEnd()
        }

        const result = stringifyNodes(nodes)

        if (cb) {
            cb(result)
        }

        tagRenderer.finishRun(templateInfo, { result: result })

        return result
    }
}
