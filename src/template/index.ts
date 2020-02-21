import {
    parseTemplate,
} from './parsers'

import {
    setKeeper,
} from './setkeeper'

export const getTemplate = (templateText: string) => {
    const sk = setKeeper()
    sk.next(/* init */)

    const result = parseTemplate(sk).run(templateText)

    return result.isError
        ? result
        : sk.next('stop').value
}
