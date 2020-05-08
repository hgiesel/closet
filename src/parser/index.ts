import nearley from 'nearley'
import grammar from './template'

import {
    mkTagInfo,
} from '../types'

const parseTemplate = (text: string) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = parser.feed(text + '$').results

    if (result.length > 1) {
        console.error('Ambiguous template grammar', result)
    }
    else if (result.length < 1) {
        console.error('Template grammar does not match')
    }

    return mkTagInfo(0, text.length, result[0])
}

export default parseTemplate
