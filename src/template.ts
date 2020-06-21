import type { TagInfo, TagData } from './tags'
import type { FilterManager } from './filterManager'

import { Parser } from './parser'
import { postfixReplace } from './postfixReplace'

type TagPath = number[]

const MAX_ITERATIONS = 50

const splitTextFromIntervals = (text: string, intervals: [number, number][]): string[] => {
    const result = []

    for (const [ivlStart, ivlEnd] of intervals) {
        result.push(text.slice(ivlStart, ivlEnd))
    }

    return result
}

export class Template {
    private textFragments: string[]
    private baseDepth: number
    private parser: Parser

    private rootTag: TagInfo
    private currentZoom: TagPath

    private constructor(text: string[], baseDepth: number, preparsed: TagInfo, zoom: TagPath) {
        this.textFragments = text
        this.baseDepth = baseDepth
        this.parser = new Parser()

        this.rootTag = preparsed ?? this.parser.parse(text, baseDepth)

        this.currentZoom = zoom
    }

    static make(text: string) {
        return new Template([text], 1, null, [])
    }

    static makeFromFragments(texts: string[]) {
        return new Template(texts, 2, null, [])
    }

    zoom(zoom: number[]) {
        return new Template(this.textFragments /* TODO probably bad idea */, this.baseDepth, this.rootTag, zoom)
    }

    traverse (path: TagPath): TagInfo {
        let currentPos = this.rootTag

        for (const p of path) {
            if (currentPos.innerTags[p]) {
                currentPos = currentPos.innerTags[p]
            }

            else {
                return null
            }
        }

        return currentPos
    }

    render(filterManager: FilterManager, cb?: (t: string[]) => void) {
        let ready = false
        let text = this.textFragments.join('')
        let baseStack = []

        filterManager.setTemplateInfo({
            template: this,
            parser: this.parser,
        })

        for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
            console.groupCollapsed(`Iteration ${i}`)
            const iterationInfo = {
                iteration: i,
                baseDepth: this.baseDepth,
            }

            const [
                newText,
                /* finalOffset */,
                newReady,
                newBaseStack,
            ] = postfixReplace(
                text,
                this.rootTag,
                this.baseDepth,
                filterManager.filterProcessor(iterationInfo),
                this.parser,
            )

            text = newText
            ready = newReady
            baseStack = newBaseStack

            filterManager.executeDeferred(iterationInfo)
            console.groupEnd()
        }

        const result = splitTextFromIntervals(text, baseStack)

        if (cb) {
            cb(result)
        }

        filterManager.executeAftermath()
        filterManager.reset()

        return result
    }

    exists(path = this.currentZoom): boolean {
        const resultTag = this.traverse(path)

        return resultTag
            ? true
            : false
    }

    getInfo(path = this.currentZoom): TagInfo | null {
        return this.traverse(path)
    }

    getData(path = this.currentZoom): TagData | null {
        const maybeTagInfo = this.traverse(path)

        if (maybeTagInfo) {
            return maybeTagInfo.data
        }

        return null
    }

    getOffsets(path = this.currentZoom): [number, number] | null {
        const maybeTagInfo = this.traverse(path)

        if (maybeTagInfo) {
            return [0, maybeTagInfo.start]
        }

        return null
    }

    setZoom(path: TagPath): void {
        this.currentZoom = path
    }
}
