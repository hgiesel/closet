// import {
//     parseTemplate,
// } from './parsers'

// import {
//     setKeeper,
// } from './setkeeper'
//
import nearley from 'nearley'
import grammar from './template'

export const parseTemplate = (text: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(text).results[0]

    return result
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
