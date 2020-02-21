import {
    SlangTypes,
    SlangProg,
    SlangNumber,
    SlangString,
    SlangBool,
    SlangSymbol,
    SlangList,
    Slang,
    Sign,
} from '../types'

import {
    mkNumber,
} from '../constructors'

import {
    SlangTypeError,
} from './exception'

export const execute = function(prog: SlangProg) {
    const results = []

    for (const statement of prog.statements) {
        results.push(executeStatement(statement))
    }

    return results
}

const executeStatement = function(stmt: Slang) {

    switch (stmt.kind) {

        case SlangTypes.List:
            return executeList(stmt)


        default:
        // case SlangTypes.Number:
        // case SlangTypes.String:
        // case SlangTypes.Bool:
            return stmt
    }
}

const executeList = function(lst: SlangList) {
    const proc = lookupHead(lst.head)
    return proc(lst.tail.map(executeStatement))
}

const lookupHead = function(head: Slang) {

    switch (head.kind) {
        case SlangTypes.Symbol:
            return lookupHeadSymbol(head)
        default:
            return
    }
}

const lookupHeadSymbol = function(headSymbol: SlangSymbol) {
    switch (headSymbol.value) {
        case '+':
            return (args: Slang[]) => {
                let sum = 0

                for (const arg of args) {
                    if (arg.kind !== SlangTypes.Number) {
                        throw new SlangTypeError('Expected number')
                    }
                    sum += arg.real
                }

                return mkNumber(Sign.Positive, sum, 0)
            }

        case '*':
            return (args: Slang[]) => {
                let prod = 0

                for (const arg of args) {
                    if (arg.kind !== SlangTypes.Number) {
                        throw new SlangTypeError('Expected number')
                    }
                    prod *= arg.real
                }

                return mkNumber(Sign.Positive, prod, 0)
            }
    }
}
