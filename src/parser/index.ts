import nearley from 'nearley'
import grammar from './template'

const parseTemplate = (text: string) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const parsed = parser.feed(text + '$').results

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }
    else if (parsed.length < 1) {
        console.error('Template grammar does not match')
    }

    const result = parsed[0].endToken(text.length, 'raw', text).value
    parsed[0].restart()

    return result
}

export default parseTemplate