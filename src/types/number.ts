import {
    digit,
    choice,
    str,
    many1,
    between,
    sequenceOf,
    takeRight,
    possibly,
} from 'arcsecond'

import {
    joiner,
} from './utils'

import {
    SlangTypes,
} from './types'

enum Sign {
    Positive,
    Negative,
}

export interface SlangNumber {
    kind: SlangTypes.Number
    sign: Sign,
    real: number,
    imaginary: number,
}

export const mkNumber = (sgn: Sign, re: number, im: number): SlangNumber => ({
    kind: SlangTypes.Number,
    sign: sgn,
    real: Number(re),
    imaginary: Number(im),
})

const sign = choice([
    str('+'),
    str('-'),
])

const stringToSign = (str: string): Sign => {
    return str === '-'
        ? Sign.Negative
        : Sign.Positive
}

const integer = many1(digit).map(joiner)

export const real = sequenceOf([
    integer,
    possibly(
        takeRight(str('.'))(integer)
    )
])

export const parseNumber = sequenceOf([
    possibly(sign),
    real,
    possibly(between(str('+'))(str('i'))(real)),
])
    .map((vs: [string | null, [string,string | null], [string,string | null] | null]) => mkNumber(
        stringToSign(vs[0]),
        Number(vs[1].join('.')),
        vs[2] ? Number(vs[2].join('.')) : 0,
    ))
