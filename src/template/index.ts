// import {
//     parseTemplate,
// } from './parsers'

// import {
//     setKeeper,
// } from './setKeeper'
//
import nearley from 'nearley'
import grammar from './template'

export const parseTemplate = (text: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(text + '$').results

    if (result.length > 1) {
        console.error('Ambiguous template grammar', result)
    }
    else if (result.length < 1) {
        console.error('Template grammar does not match')
    }

    return result[0]
}

export default parseTemplate

// export const getTemplate = (templateText: string) => {
//     const sk = setKeeper()
//     sk.next(/* init */)

//     const result = parseTemplate(sk).run(templateText)

//     return result.isError
//         ? result
//         : sk.next('stop').value
// }
