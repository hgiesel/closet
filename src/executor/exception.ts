import type {
    Slang,
} from '../types'

export class SlangTypeError extends Error {
  constructor(context: string, types: string, position: string | number, ...params: any[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlangTypeError)
    }

    this.name = 'TypeError'
    this.message = `Wrong argument(s) ${types} passed to \`${context}\` at position ${position}.`
  }
}

export class SlangArityError extends Error {
  constructor(context: string, argc: number, ...params: any[]) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlangArityError)
    }

    this.name = 'ArityError'
    this.message = `Wrong number of arguments (${argc}) passed to \`${context}\`.`
  }
}

interface Typecheckers {
    argc?: (count: number) => boolean,
    arg0?: (arg: Slang) => boolean,
    arg1?: (arg: Slang) => boolean,
    arg2?: (arg: Slang) => boolean,
    arg3?: (arg: Slang) => boolean,
    arg4?: (arg: Slang) => boolean,
    arg5?: (arg: Slang) => boolean,
    args?: (args: Slang[]) => boolean,
}

export const typecheck = (
    name: string,
    f: (args: Slang[], ctx: Map<string, Slang>) => Slang,
    {argc, arg0, arg1, arg2, arg3, arg4, arg5, args}: Typecheckers,
) => (as: Slang[], ctx: Map<string, Slang>): Slang => {
    if (argc && !argc(as.length)) {
        throw new SlangArityError(name, as.length)
    }

    if (arg0 && !arg0(as[0])) {
        throw new SlangTypeError(name, as[0].kind, 0)
    }

    if (arg1 && !arg1(as[1])) {
        throw new SlangTypeError(name, as[1].kind, 1)
    }

    if (arg2 && !arg2(as[2])) {
        throw new SlangTypeError(name, as[2].kind, 2)
    }

    if (arg3 && !arg3(as[3])) {
        throw new SlangTypeError(name, as[3].kind, 3)
    }

    if (arg4 && !arg4(as[4])) {
        throw new SlangTypeError(name, as[4].kind, 4)
    }

    if (arg5 && !arg5(as[5])) {
        throw new SlangTypeError(name, as[5].kind, 5)
    }

    if (args && !args(as)) {
        throw new SlangTypeError(name, `(${as.map(v => v.kind).join(', ')})`, '*')
    }

    return f(as, ctx)
}
