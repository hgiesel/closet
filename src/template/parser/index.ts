import nearley from 'nearley'
import grammar from './template'

import type { TagBuilderSettings } from './tagBuilder'
import type { TagInfo } from '../tags'

import { tagBuilder, tagInfoBuilder } from './template'

const makeTrivialBaseTagInfo = (text: string): TagInfo => tagInfoBuilder.build(
    0,
    text.length,
    tagBuilder.build('base', text),
    [],
)

const coreParse = (text: string): TagInfo[] => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

    try {
        console.time('parse')
        const result = parser.feed(text + '$').results
        console.timeEnd('parse')
        console.log(result[0]._innerTags)
        return result
    }
    catch (e) {
        console.error(`Error parsing text:`, e)
        console.info('Default to Trivial Base Tag')

        return [makeTrivialBaseTagInfo(text)]
    }
}

const mainParse = (text: string): TagInfo => {
    let parsed: TagInfo[] = coreParse(text)

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }

    return parsed[0]
}

const parseTemplate = (text: string): TagInfo => {
    const result = mainParse(text)

    return result
}

const parseTemplateFragments = (textFragments: string[]): TagInfo => {
    const parsedFragments: TagInfo[] = []

    for (const fragment of textFragments) {
        const parsed = mainParse(fragment)
        parsedFragments.push(parsed)

        tagInfoBuilder.addLeftOffset(fragment.length)
    }

    const lastOffset = tagInfoBuilder.pop()
    const result = tagInfoBuilder.build(
        0,
        lastOffset,
        tagBuilder.build('base', textFragments.join('')),
        parsedFragments,
    )

    return result
}

export enum BaseDepth {
    Single = 1,
    Fragments = 2,
}

export class Parser {
    tagBuilderSettings: TagBuilderSettings = [new Map(), new Map()]

    parse (texts: string[], baseDepth: BaseDepth, baseLeftOffset = 0): TagInfo {
        let result: TagInfo | null = null

        tagBuilder.push(this.tagBuilderSettings)
        tagInfoBuilder.push(baseLeftOffset)

        switch (baseDepth) {
            case BaseDepth.Single:
                result = parseTemplate(texts[0])
                break
            case BaseDepth.Fragments:
                result = parseTemplateFragments(texts)
                break
            default:
                throw new Error('should not happen')
        }

        return result
    }

    rawParse (text: string, baseLeftOffset = 0): TagInfo[] {
        tagInfoBuilder.push(baseLeftOffset)
        tagBuilder.push(this.tagBuilderSettings)

        const result = mainParse(text).innerTags
        return result
    }
}
