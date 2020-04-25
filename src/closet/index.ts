import nearley from 'nearley'
import grammar from './slang'

export const parseCode = (code: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(code).results

    if (result.length > 1) {
        console.error('Ambiguous closet grammar', result)
    }
    else if (result.length < 1) {
        console.error('Closet grammar does not match')
    }

    return result[0]
}

export default parseCode
