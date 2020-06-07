import nearley from 'nearley'
import grammar from './template'

import type { TagInfo } from '../tags'
import { tagFactory, tagInfoFactory } from './template'

const makeTrivialBaseTagInfo = (text: string): TagInfo => tagInfoFactory.build(
    0,
    text.length,
    tagFactory.build('base', text),
    [],
)

const mainParse = (text: string): TagInfo => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let parsed: TagInfo[] = null

    try {
        parsed = parser.feed(text + '$').results
    }
    catch (e) {
        console.error(`Error parsing text:`, e)
        console.info('Default to Trivial Base Tag')

        parsed = [makeTrivialBaseTagInfo(text)]
    }

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }

    return parsed[0]
}

const parseTemplate = (text: string): TagInfo => {
    const result = mainParse(text)

    tagFactory.reset()
    return result
}

const parseTemplateFragments = (textFragments: string[]): TagInfo => {
    const parsedFragments: TagInfo[] = []

    for (const fragment of textFragments) {
        tagFactory.signalTagOpen()

        const parsed = mainParse(fragment)
        parsedFragments.push(parsed)

        tagInfoFactory.addToLeftOffset(fragment.length)
    }

    const lastOffset = tagInfoFactory.resetLeftOffset()
    const result = tagInfoFactory.build(
        0,
        lastOffset,
        tagFactory.build('base', textFragments.join('')),
        parsedFragments,
    )

    tagFactory.reset()
    return result
}

export const parse = (texts: string[], baseDepth: number): TagInfo => {
    switch (baseDepth) {
        case 1:
            return parseTemplate(texts[0])
        case 2:
            return parseTemplateFragments(texts)
        case 3:
            throw new Error(`baseDepth with value ${baseDepth} is not supported.`)
    }
}
