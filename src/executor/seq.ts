import type {
    Slang,
    SlangMap,
    SlangVector,
    SlangUnit,
    SlangList,
    SlangOptional,
    SlangNumber,
    SlangBool,
    SlangMapKey,
    SlangArmedFunction,
} from '../types'

import {
    mkUnit,
    mkOptional,
    mkMap,
    mkVector,
    mkList,
    mkNumber,
    mkBool,
    fromMapKey,
} from '../constructors'

import {
    isString,
    isVector,
    isList,
    isOptional,
} from '../reflection'

import { apply } from './functions'
import { pureToBool } from './coerce'

export namespace Map {
    export const getFunc = ([mapArg, idx, defaultValue]: [SlangMap, SlangMapKey, Slang]): Slang => {
        const key = isString(idx)
            ? idx.value
        //@ts-ignore
            : Symbol.for(idx.value)

        const result = mapArg.table.has(key)
            ? mapArg.table.get(key)
            : defaultValue

        return result
    }

    export const take = ([count, mapArg]: [SlangNumber, SlangMap]): SlangMap => {
        const taken = []

        mapArg.table.forEach((v, k) => {
            if (taken.length < count.value) {
                taken.push([k, v])
            }
        })

        return mkMap(taken)
    }

    export const takeWhile = ([pred, mapArg]: [SlangArmedFunction, SlangMap]): SlangMap => {
        const taken = []

        let cont = true
        mapArg.table.forEach((v, k) => {
            if (cont) {
                const result = pureToBool(apply(pred, [mkVector([fromMapKey(k), v])]))
                if (result) {
                    taken.push([k, v])
                }
                else {
                    cont = false
                }
            }
        })

        return mkMap(taken)
    }

    export const drop = ([count, mapArg]: [SlangNumber, SlangMap]): SlangMap => {
        const dropped = []
        let innerCount = 0

        mapArg.table.forEach((v, k) => {
            if (innerCount < count.value) {
                innerCount++
            }

            else {
                dropped.push([k, v])
            }
        })

        return mkMap(dropped)
    }

    export const dropWhile = ([pred, mapArg]: [SlangArmedFunction, SlangMap]): SlangMap => {
        const dropped = []

        let start = false
        mapArg.table.forEach((v, k) => {
            if (start) {
                dropped.push([k, v])
            }
            else {
                start = pureToBool(apply(pred, [mkVector([fromMapKey(k), v])]))
            }
        })

        return mkMap(dropped)
    }

    export const count = ([mapArg]: [SlangMap]): SlangNumber => {
        return mkNumber(mapArg.table.size)
    }

    export const emptyQ = ([mapArg]: [SlangMap]): SlangBool => {
        return mkBool(mapArg.table.size === 0)
    }

    export const anyQ = ([pred, mapArg]: [SlangArmedFunction, SlangMap]): SlangBool => {
        let result = false
        mapArg.table.forEach((v, k) => {
            result = result || pureToBool(apply(pred, [mkVector([fromMapKey(k), v])]))
        })

        return mkBool(result)
    }

    export const everyQ = ([pred, mapArg]: [SlangArmedFunction, SlangMap]): SlangBool => {
        let result = true
        mapArg.table.forEach((v, k) => {
            result = result && pureToBool(apply(pred, [mkVector([fromMapKey(k), v])]))
        })

        return mkBool(result)
    }

    export const map = ([func, headMap, ...otherMaps]: [SlangArmedFunction, SlangMap, ...SlangMap[]]) => {
        const result: [SlangMapKey, Slang][] = []

        headMap.table.forEach((v, k) => {
            let allHaveKey = true
            for (const m of otherMaps) {
                allHaveKey = allHaveKey && m.table.has(k)
            }

            if (allHaveKey) {
                const theKey = fromMapKey(k)
                result.push([theKey, apply(func, [
                    mkVector([theKey, v]),
                    ...otherMaps.map(m => mkVector([theKey, m.table.get(k)])),
                ])])
            }
        })

        return mkMap(result)
    }

    export const filter = ([func, map]: [SlangArmedFunction, SlangMap]) => {
        const result: [SlangMapKey, Slang][] = []

        map.table.forEach((v, k) => {
            const theKey = fromMapKey(k)
            if (pureToBool(apply(func, [mkVector([theKey, v])]))) {
                result.push([theKey, v])
            }
        })

        return mkMap(result)
    }

    export const foldl = ([func, accu, map]: [SlangArmedFunction, Slang, SlangMap]): Slang => {
        let result = accu

        for (const [key, value] of map.table) {
            const theKey = fromMapKey(key)

            console.log('hi', result)
            result = apply(func, [result, mkVector([theKey, value])])
        }

        console.log(result)
        return result
    }

    export const foldr = ([func, accu, map]: [SlangArmedFunction, Slang, SlangMap]) => {
        console.log('hi')
        const iterator = map.table[Symbol.iterator]()

        const pureFoldr = (it: Iterator<Slang>) => {
            const nextValue = it.next()

            if (nextValue.done) {
                return accu
            }
            else {
                const [key, value] = nextValue.value
                return apply(func, [mkVector([fromMapKey(key), value]), pureFoldr(it)])
            }
        }

        //@ts-ignore
        const result = pureFoldr(iterator)
        return result
    }

}

export namespace Vector {
    export const getFunc = ([seqArg, idx, defaultValue]: [SlangVector, SlangNumber, Slang]): Slang => {
        const result = seqArg.members[idx.value] ?? defaultValue
        return result
    }

    export const vector = ([...values]: [...Slang[]]): SlangVector => {
        return mkVector(values)
    }

    export const take = ([count, vectorArg]: [SlangNumber, SlangVector]): SlangVector => {
        const taken = []

        for (let i = 0; i < count.value; i++) {
            if (vectorArg.members[i]) {
                taken.push(vectorArg.members[i])
            }
        }

        return mkVector(taken)
    }

    export const takeWhile = ([pred, vectorArg]: [SlangArmedFunction, SlangVector]): SlangVector => {
        const taken = []

        let cont = true
        for (let i = 0; i < vectorArg.members.length && cont; i++) {
            if (pureToBool(apply(pred, [vectorArg.members[i]]))) {
                taken.push(vectorArg.members[i])
            }
            else {
                cont = false
            }
        }

        return mkVector(taken)
    }

    export const drop = ([count, vectorArg]: [SlangNumber, SlangVector]): SlangVector => {
        const dropped = []

        for (let i = 0; i < vectorArg.members.length; i++) {
            if (i >= count.value) {
                dropped.push(vectorArg.members[i])
            }
        }

        return mkVector(dropped)
    }

    export const dropWhile = ([pred, vectorArg]: [SlangArmedFunction, SlangVector]): SlangVector => {
        const dropped = []

        let start = false
        for (let i = 0; i < vectorArg.members.length; i++) {
            if (start) {
                dropped.push(vectorArg.members[i])
            }
            else {
                if (!pureToBool(apply(pred, [vectorArg.members[i]]))) {
                    dropped.push(vectorArg.members[i])
                    start = true
                }
            }
        }

        return mkVector(dropped)
    }

    export const count = ([vectorArg]: [SlangVector]): SlangNumber => {
        return mkNumber(vectorArg.members.length)
    }

    export const emptyQ = ([vectorArg]: [SlangVector]): SlangBool => {
        return mkBool(vectorArg.members.length === 0)
    }

    export const anyQ = ([pred, vectorArg]: [SlangArmedFunction, SlangVector]): SlangBool => {
        let result = false
        for (const m of vectorArg.members) {
            result = result || pureToBool(apply(pred, [m]))
        }

        return mkBool(result)
    }

    export const everyQ = ([pred, vectorArg]: [SlangArmedFunction, SlangVector]): SlangBool => {
        let result = true
        for (const m of vectorArg.members) {
            result = result && pureToBool(apply(pred, [m]))
        }

        return mkBool(result)
    }

    export const map = ([func, headVector, ...otherVectors]: [SlangArmedFunction, SlangVector, ...SlangVector[]]) => {
        const result = []

        for (const [i, entry] of headVector.members.entries()) {
            let allHaveKey = true

            for (const v of otherVectors) {
                allHaveKey = allHaveKey && (v.members.length >= i)
            }

            if (allHaveKey) {
                result.push(apply(func, [entry, ...otherVectors.map(v => v.members[i])]))
            }
        }

        return mkVector(result)
    }

    export const filter = ([func, vector]: [SlangArmedFunction, SlangVector]) => {
        const result = []

        for (const v of vector.members) {
            if (pureToBool(apply(func, [v]))) {
                result.push(v)
            }
        }

        return mkVector(result)
    }

    export const foldl = ([func, accu, vector]: [SlangArmedFunction, Slang, SlangVector]): Slang => {
        let result = accu

        for (const value of vector.members) {
            result = apply(func, [result, value])
        }

        return result
    }

    export const foldr = ([func, accu, vector]: [SlangArmedFunction, Slang, SlangVector]) => {
        const iterator = vector.members[Symbol.iterator]()

        const pureFoldr = (it: Iterator<Slang>) => {
            const nextValue = it.next()

            return nextValue.done
                ? accu
                : apply(func, [nextValue.value, pureFoldr(it)])
        }

        const result = pureFoldr(iterator)
        return result
    }

    export const fzip = ([...vectors]: SlangVector[]) => {
        return flat([mkVector(vectors)])
    }

    export const flat = ([vector]: [SlangVector]) => {
        const results = []

        for (const value of vector.members) {
            if (isVector(value)) {
                results.push(...value.members)
            }
            else {
                results.push(value)
            }
        }
        return mkVector(results)
    }

    export const bind = ([func, headVector, ...otherVectors]: [SlangArmedFunction, SlangVector, ...SlangVector[]]) => {
        const arg = otherVectors.length === 0
            ? headVector
            : fzip([headVector, ...otherVectors])

        return flat([map([func, arg])])
    }
}

export namespace List {
    export const getFunc = ([seqArg, idx, defaultValue]: [SlangList, SlangMapKey | SlangNumber, Slang]): Slang => {
        return idx.value === 0
            ? seqArg.head
        //@ts-ignore
            : (seqArg.tail[idx.value - 1] ?? defaultValue)
    }

    export const list = ([head, ...values]: [Slang]): SlangList => {
        return mkList(head, values)
    }

    export const take = ([count, listArg]: [SlangNumber, SlangList]): SlangList | SlangUnit => {
        const taken = []

        if (count.value <= 0) {
            return mkUnit()
        }
        else {
            taken.push(listArg.head)

            for (let i = 0; i < count.value - 1; i++) {
                if (listArg.tail[i]) {
                    taken.push(listArg.tail[i])
                }
            }
        }

        return mkList(taken[0], taken.slice(1))
    }

    export const takeWhile = ([pred, listArg]: [SlangArmedFunction, SlangList]): SlangList | SlangUnit => {
        const taken = []

        let cont = true
        if (!pureToBool(apply(pred, [listArg.head]))) {
            return mkUnit()
        }
        else {
            taken.push(listArg.head)

            for (let i = 0; i < listArg.tail.length && cont; i++) {
                if (pureToBool(apply(pred, [listArg.tail[i]]))) {
                    taken.push(listArg.tail[i])
                }
                else {
                    cont = false
                }
            }
        }

        return mkList(taken[0], taken.slice(1))
    }

    export const drop = ([count, listArg]: [SlangNumber, SlangList]): SlangList | SlangUnit => {
        const dropped = []

        if (count.value === 0) {
            dropped.push(listArg.head)
        }

        for (let i = 0; i < listArg.tail.length; i++) {
            if (i >= count.value - 1) {
                dropped.push(listArg.tail[i])
            }
        }

        return dropped.length === 0
            ? mkUnit()
            : mkList(dropped[0], dropped.slice(1))
    }

    export const dropWhile = ([pred, listArg]: [SlangArmedFunction, SlangList]): SlangList | SlangUnit => {
        const dropped = []

        let start = false
        if (!pureToBool(apply(pred, [listArg.head]))) {
            dropped.push(listArg.head)
            start = true
        }

        for (let i = 0; i < listArg.tail.length; i++) {
            if (start) {
                dropped.push(listArg.tail[i])
            }
            else {
                if (!pureToBool(apply(pred, [listArg.tail[i]]))) {
                    dropped.push(listArg.tail[i])
                    start = true
                }
            }
        }

        return dropped.length === 0
            ? mkUnit()
            : mkList(dropped[0], dropped.slice(1))
    }

    export const count = ([listArg]: [SlangList]): SlangNumber => {
        return mkNumber(listArg.tail.length)
    }

    export const emptyQ = ([listArg]: [SlangList]): SlangBool => {
        return mkBool(listArg.tail.length === 0)
    }

    export const anyQ = ([pred, listArg]: [SlangArmedFunction, SlangList]): SlangBool => {
        let result = false
        for (const m of listArg.tail) {
            result = result || pureToBool(apply(pred, [m]))
        }

        return mkBool(result)
    }

    export const everyQ = ([pred, listArg]: [SlangArmedFunction, SlangList]): SlangBool => {
        let result = true
        for (const m of listArg.tail) {
            result = result && pureToBool(apply(pred, [m]))
        }

        return mkBool(result)
    }

    export const map = ([func, headList, ...otherLists]: [SlangArmedFunction, SlangList, ...SlangList[]]) => {
        const result = []

        for (const [i, entry] of headList.tail.entries()) {
            let allHaveKey = true

            for (const v of otherLists) {
                allHaveKey = allHaveKey && (v.tail.length >= i)
            }

            if (allHaveKey) {
                result.push(apply(func, [entry, ...otherLists.map(v => v.tail[i])]))
            }
        }

        return mkList(headList.head, result)
    }

    export const filter = ([func, list]: [SlangArmedFunction, SlangList]) => {
        const result = []

        for (const v of list.tail) {
            if (pureToBool(apply(func, [v]))) {
                result.push(v)
            }
        }

        return mkList(list.head, result)
    }

    export const foldl = ([func, accu, list]: [SlangArmedFunction, Slang, SlangList]): Slang => {
        let result = accu

        for (const value of list.tail) {
            result = apply(func, [result, value])
        }

        return result
    }

    export const foldr = ([func, accu, list]: [SlangArmedFunction, Slang, SlangList]) => {
        const iterator = list.tail[Symbol.iterator]()

        const pureFoldr = (it: Iterator<Slang>) => {
            const nextValue = it.next()

            return nextValue.done
                ? accu
                : apply(func, [nextValue.value, pureFoldr(it)])
        }

        const result = pureFoldr(iterator)
        return result
    }

    export const flat = ([list]: [SlangList]) => {
        const results = []

        for (const value of list.tail) {
            if (isList(value)) {
                results.push(...value.tail)
            }
            else {
                results.push(value)
            }
        }
        return mkList(list.head, results)
    }
}

export namespace Optional {
    export const getFunc = ([seqArg, idx, defaultValue]: [SlangOptional, SlangBool, Slang]): Slang => {
        return idx.value
            ? seqArg.boxed ?? defaultValue
            : defaultValue
    }

    export const optional = ([...values]: [Slang]): SlangOptional => {
        return mkOptional(values[0] ?? null)
    }

    export const count = ([optionalArg]: [SlangOptional]): SlangNumber => {
        return mkNumber(optionalArg.boxed === null ? 0 : 1)
    }

    export const emptyQ = ([optionalArg]: [SlangOptional]): SlangBool => {
        return mkBool(optionalArg.boxed === null)
    }

    export const anyQ = ([pred, optionalArg]: [SlangArmedFunction, SlangOptional]): SlangBool => {
        let result = false
        if (optionalArg.boxed) {
            result = result || pureToBool(apply(pred, [optionalArg.boxed]))
        }

        return mkBool(result)
    }

    export const everyQ = ([pred, optionalArg]: [SlangArmedFunction, SlangOptional]): SlangBool => {
        let result = true
        if (optionalArg.boxed) {
            result = result && pureToBool(apply(pred, [optionalArg.boxed]))
        }

        return mkBool(result)
    }

    export const map = ([func, headOptional, ...otherOptionals]: [SlangArmedFunction, SlangOptional, ...SlangOptional[]]) => {
        let result = null

        if (headOptional.boxed) {
            let allHaveKey = true

            for (const v of otherOptionals) {
                allHaveKey = allHaveKey && (v.boxed !== null)
            }

            if (allHaveKey) {
                result = apply(func, [headOptional.boxed, ...otherOptionals.map(v => v.boxed)])
            }
        }

        return mkOptional(result)
    }

    export const filter = ([func, optional]: [SlangArmedFunction, SlangOptional]) => {
        let result = null

        if (optional.boxed) {
            if (pureToBool(apply(func, [optional.boxed]))) {
                result = optional.boxed
            }
        }

        return mkOptional(result)
    }

    export const foldl = ([func, accu, optional]: [SlangArmedFunction, Slang, SlangOptional]): Slang => {
        let result = accu

        if (optional.boxed) {
            result = apply(func, [result, optional.boxed])
        }

        return result
    }

    export const foldr = ([func, accu, optional]: [SlangArmedFunction, Slang, SlangOptional]) => {
        let result = accu

        if (optional.boxed) {
            result = apply(func, [optional.boxed, result])
        }

        return result
    }

    export const fzip = ([...optionals]: SlangOptional[]) => {
        let result = mkVector([])

        for (const opt of optionals) {
            if (!opt.boxed) {
                result = null
                break
            }

            result.members.push(opt.boxed)
        }

        return mkOptional(result)
    }

    export const flat = ([optional]: [SlangOptional]) => {
        return optional.boxed && isOptional(optional.boxed)
            ? optional.boxed
            : optional
    }

    export const bind = ([func, headOptional, ...otherOptionals]: [SlangArmedFunction, SlangOptional, ...SlangOptional[]]) => {
        const arg = otherOptionals.length === 0
            ? headOptional
            : fzip([headOptional, ...otherOptionals])

        return flat([map([func, arg])])
    }
}

export const indexing = ([listArg, idx]: [SlangVector, SlangNumber]): SlangOptional => {
    return mkOptional(listArg.members[idx.value] ?? null)
}
