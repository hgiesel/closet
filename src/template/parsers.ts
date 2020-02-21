import {
    endOfInput,
    everythingUntil,
    str,
    many,
    skip,
    pipeParsers,
    anyOfString,
    sepBy1,
    choice,
    anythingExcept,
    takeRight,
    regex,
    tapParser,
    lookAhead,
    sequenceOf,
    recursiveParser,
    withData,
} from 'arcsecond'

import {
    mkElement,
} from '../constructors'

const escapeCharacter = (ch: str) => {
    switch (ch) {
        default:
            return ch
    }
}

const beforeLogger = ({isError, data, index}) => {
    if (!isError) {
        data.next([index])
    }
}

const afterLogger = ({isError, data, index, result}) => {
    if (!isError) {
        data.next([-index, result])
    }
}

export const setParser = recursiveParser(() => pipeParsers([
    tapParser(beforeLogger),
    inSetParser,
    skip(tapParser(afterLogger)),
]))

export const innerSetSkip = everythingUntil(str(']]'))

export const innerSetParser = (takeRight(lookAhead(setParser))(innerSetSkip))

export const escapeCharacterParser = takeRight(str('\\'))(regex(/^./))
    .map(escapeCharacter)

export const valueParser = many(choice([
    anythingExcept(choice([
        anyOfString('\\|'),
        str('::'),
        str('[['),
        str(']]'),
    ])),
    escapeCharacterParser,
    sequenceOf([str('[['), innerSetParser, str(']]')]).map((vs: string[]) => vs.join('')),
])).map((chars: string[]) => chars.join(''))

export const elementParser = (
    sepBy1(str('|'))(valueParser)
).map(mkElement)

export const inSetParser = sepBy1(str('::'))(elementParser)

export const parseTemplate = withData(pipeParsers([
    many(takeRight(everythingUntil(str('[[')))(pipeParsers([
        str('[['),
        setParser,
        skip(str(']]')),
    ]))),
    skip(everythingUntil(endOfInput)),
]))
