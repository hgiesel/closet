import type {
    Slang,
    SlangEither,
} from '../types'

import {
    mkLeft,
    mkRight,
} from '../constructors'

export type SlangError = SlangTypeError
                       | SlangArityError
                       | SlangNotExecutableError

// `Wrong argument(s) ${types} passed at position ${position}.`
interface SlangTypeError {
    kind: 'TypeError',
    types: string,
    position: string | number,
}

interface SlangArityError {
    kind: 'ArityError',
    argc: number,
}

interface SlangNotExecutableError {
    kind: 'NotExecutableError',
    valueType: string,
}

const mkTypeError = (types: string, position: string | number): SlangTypeError => ({
    kind: 'TypeError',
    types: types,
    position: position,
})

const mkArityError = (argc: number): SlangArityError => ({
    kind: 'ArityError',
    argc: argc,
})

const mkNotExecutableError = (valueType: string): SlangNotExecutableError => ({
    kind: 'NotExecutableError',
    valueType: valueType,
})

export const throwException = (name: string, e: SlangError) => {
    switch (e.kind) {
        case 'ArityError':
            throw new TypeError( [
                e.kind,
                name,
                `Wrong amount of arguments (${e.argc}) passed.`,
            ].join(': '))

        case 'TypeError':
            throw new TypeError( [
                e.kind,
                name,
                `Wrong type(s) of arguments (${e.types}) passed for ${e.position}.`,
            ].join(': '))

        case 'NotExecutableError':
            throw new TypeError( [
                e.kind,
                name,
                `Value of type (${e.valueType}) cannot be executed.`,
            ].join(': '))
    }
}

interface Typecheckers {
    f?: (args: Slang[], ctx: Map<string, Slang>) => Slang,
    argc?: (count: number) => boolean,
    arg0?: (arg: Slang) => boolean,
    arg1?: (arg: Slang) => boolean,
    arg2?: (arg: Slang) => boolean,
    arg3?: (arg: Slang) => boolean,
    arg4?: (arg: Slang) => boolean,
    arg5?: (arg: Slang) => boolean,
    args?: (args: Slang[]) => boolean,
    inf?: (args: Slang[]) => (args: Slang[], ctx: Map<string, Slang>) => Slang,
}

export const typecheck = ({
    f,
    inf,
    argc,
    arg0,
    arg1,
    arg2,
    arg3,
    arg4,
    arg5,
    args
}: Typecheckers) => (argums: Slang[], ctx: Map<string, Slang>): SlangEither => {
    if (argc && !argc(argums.length)) {
        return mkLeft(mkArityError(argums.length))
    }

    if (arg0 && !arg0(argums[0])) {
        return mkLeft(mkTypeError(argums[0].kind, 1))
    }

    if (arg1 && !arg1(argums[1])) {
        return mkLeft(mkTypeError(argums[1].kind, 2))
    }

    if (arg2 && !arg2(argums[2])) {
        return mkLeft(mkTypeError(argums[2].kind, 3))
    }

    if (arg3 && !arg3(argums[3])) {
        return mkLeft(mkTypeError(argums[3].kind, 4))
    }

    if (arg4 && !arg4(argums[4])) {
        return mkLeft(mkTypeError(argums[4].kind, 5))
    }

    if (arg5 && !arg5(argums[5])) {
        return mkLeft(mkTypeError(argums[5].kind, 6))
    }

    if (args && !args(argums)) {
        return mkLeft(mkTypeError(`(${argums.map(v => v.kind).join(', ')})`, '*'))
    }

    const exec = inf
        ? inf(argums)
        : f

    return mkRight(exec(argums, ctx))
}

export const notExecutable = (kind: string): SlangError => {
    return mkNotExecutableError(kind)
}
