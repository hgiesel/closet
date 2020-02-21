import {
    SlangTypes,
    SlangProg,
    SlangSymbol,
    SlangList,
    Slang,
} from '../types'

import {
    isSymbol,
    isVector,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

import * as math from './math'
import * as map from './map'
import * as vector from './vector'

import * as lookup from './lookup'

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

        case SlangTypes.Symbol:
            return lookup.globalLookup(stmt)

        default:
            // case SlangTypes.Number:
            // case SlangTypes.String:
            // case SlangTypes.Bool:
            return stmt
    }
}

const executeList = function(lst: SlangList) {
    switch (lst.head.kind) {
        case SlangTypes.Symbol:
            return symbolSwitch(lst.head, lst.tail)

        case SlangTypes.Vector:
            return vector.indexing(lst.head, lst.tail)
        case SlangTypes.Map:
            return map.indexing(lst.head, lst.tail)

        default:
            return null
    }
}

const symbolSwitch = (head: SlangSymbol, tail: Slang[]) => {
    switch (head.value) {
        case 'def':
            if (tail.length !== 2) {
                throw new SlangArityError(tail.length)
            }
            else if (!isSymbol(tail[0])) {
                throw new SlangTypeError('Value needs to be a symbol')
            }

            return lookup.globalDefine(tail[0].value, executeStatement(tail[1]))

        case 'defn':
            if (tail.length !== 3) {
                throw new SlangArityError(tail.length)
            }
            else if (!isSymbol(tail[0])) {
                throw new SlangTypeError('Value needs to be a symbol')
            }
            else if (!isVector(tail[1])) {
                throw new SlangTypeError('Value needs to be a symbol')
            }
            return

        default:
            // head must implement a function interface
            const proc = lookupHeadSymbol(head)

            return proc(tail.map(executeStatement))
    }
}

const lookupHeadSymbol = (headSymbol: SlangSymbol) => {
    switch (headSymbol.value) {
        case '+':
            return math.addition
        case '-':
            return math.subtraction
        case '*':
            return math.multiplication
    }
}
