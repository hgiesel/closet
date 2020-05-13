import nearley from 'nearley'
import grammar from './template'

import { TagInfo } from '../tags'
import { tagKeeper } from './template'

const parseTemplate = (text: string): TagInfo => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let parsed = []

    try {
        parsed = parser.feed(text + '$').results
    }
    catch (e) {
        tagKeeper.restart()
        throw e
    }

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }

    const result = tagKeeper.endToken(text.length, 'base', text, true).value as TagInfo
    tagKeeper.restart()

    return result
}

export default parseTemplate
