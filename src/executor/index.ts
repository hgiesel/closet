import {
    SlangTypes,
    SlangProg,
    SlangSymbol,
    SlangList,
    Slang,
} from '../types'

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

        default:
        // case SlangTypes.Number:
        // case SlangTypes.String:
        // case SlangTypes.Bool:
            return stmt
    }
}

const executeList = function(lst: SlangList) {
    // head must implement a function interface
    console.log(lst.head)
    const proc = lookupHead(lst.head)

    return proc(lst.tail.map(executeStatement))
}

const lookupHead = function(head: Slang) {

    switch (head.kind) {
        case SlangTypes.Symbol:
            return lookupHeadSymbol(head)

        case SlangTypes.Vector:
            return vector.indexing(head)
        case SlangTypes.Map:
            return map.indexing(head)

        default:
            return null
    }
}

const lookupHeadSymbol = function(headSymbol: SlangSymbol) {
    switch (headSymbol.value) {
        case 'def':
            return lookup.globalDefine

        case '+':
            return math.addition
        case '-':
            return math.subtraction
        case '*':
            return math.multiplication

        default:
            return lookup.globalLookup(headSymbol)
    }
}
