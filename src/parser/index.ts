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

const parse = (text: string): TagInfo => {
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

export const parseTemplate = (text: string): TagInfo => {
    const result = parse(text)

    tagFactory.reset()
    return result
}

export const parseDisjointTemplate = (textFragments: string[]): TagInfo => {
    const parsedFragments: TagInfo[] = []

    for (const fragment of textFragments) {
        tagFactory.signalTagOpen()

        const parsed = parse(fragment)
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
