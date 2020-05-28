import nearley from 'nearley'
import grammar from './template'

import { TagInfo, Tag } from '../tags'
import { tagMaker } from './template'

const makeTrivialBaseTagInfo = (text: string): TagInfo => new TagInfo(
    0,
    text.length,
    new Tag('base', 'base', null, text, 0, 0, []),
    [],
    true,
)

export const parseTemplate = (text: string): TagInfo => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let parsed = []

    try {
        parsed = parser.feed(text + '$').results
    }
    catch (e) {
        console.error(`Error parsing text:`, e)
        console.info('Default to Trivial Base Tag')

        parsed = [makeTrivialBaseTagInfo(text)]
    }
    finally {
        tagMaker.reset()
    }

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }

    return parsed[0]
}
