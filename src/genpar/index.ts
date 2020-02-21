import nearley from 'nearley'
import grammar from './slang'

export const parseCode = (code: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(code).results[0]

    return result
}

export default parseCode
