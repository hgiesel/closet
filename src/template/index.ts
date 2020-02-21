import {
    endOfInput,
    everythingUntil,
    str,
    many,
    skip,
    pipeParsers,
    anyOfString,
    sepBy,
    sepBy1,
    choice,
    anythingExcept,
    takeRight,
    regex,
    sequenceOf,
    tapParser,
} from 'arcsecond'

const escapeCharacter = (ch: str) => {
    switch (ch) {
        default:
            return ch
    }
}

export const escapeParser = takeRight(str('\\'))(regex(/^./))
    .map(escapeCharacter)

export const elementParser = sepBy1(str('|'))(many(choice([
    anythingExcept(choice([
        anyOfString('\\|'),
        str('::'),
        str(']]'),
    ])),
    escapeParser,
])).map((cs: string[]) => cs.join('')))

export const inSetParser = sepBy1(str('::'))(elementParser)

export const setParser = pipeParsers([
    everythingUntil(str('[[')),
    tapParser((v) => console.log('before', v)),
    str('[['),
    inSetParser,
    str(']]'),
    tapParser((v) => console.log('after', v)),
])

export const parseTemplate = pipeParsers([
    many(setParser),
    skip(everythingUntil(endOfInput)),
])
