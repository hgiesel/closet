import type { TagData, Internals, Eval } from './types'
import type { SortInStrategy } from './sortInStrategies'

import { sortWithIndices } from './utils'

// TODO abstract to an object without dependence on Internals
export const sequencer = <V, T extends {}>(
    // identifies each unit (tag) receiving shuffled items
    unitId: string,
    // identifies each collection of items being shuffled
    sequenceId: string,
    values: V[],
    strategy: (indices: number[], toLength: number) => number[],
    { cache, memory, deferred, ready }: Internals<T>,
): V[] | void => {
    if (values.length === 0) {
        // empty sequence cannot be shuffled + does not contribute to other parts
        return values
    }

    const applyKey = `${unitId}:apply`
    // in cache: boolean whether ready for application
    // in deferred: sets apply key true, deletes unitId from waitingSet

    const waitingSetKey = `${sequenceId}:waitingSet`
    // in cache: Set with all tags (contains unitId) who wait for their inner sets to be ready

    const shuffleKey = `${sequenceId}:shuffle`
    // in cache: holds all string values for one fullKey; will be empty after it's done
    // in memory: hold sorting indices, which are used as basis for shuffling
    // in deferred: tries to shuffle cache[shuffleKey], stops if waitingSet is not empty

    /////////// APPLY LOGIC
    if (cache.get(applyKey, false)) {
        const waitingSet = cache.get(waitingSetKey, new Set()) as Set<string>
            if (waitingSet.size > 0) {
                // continue waiting for other tags with same fullKey
                return
            }

        const popped: V[] = []
        const possibleValues = cache.get(shuffleKey, []) as V[]

        for (let x = 0; x < values.length; x++) {
            // pop off start, so the result is the same as in program logic
            const shiftedValue = possibleValues.shift()

            if (shiftedValue) {
                popped.push(shiftedValue)
            }
        }

        return popped
    }

    /////////// ADD TO SHUFFLE KEY LOGIC
    if (!ready) {
        // add to waitingSet
        cache.over(waitingSetKey, (s: Set<string>) => s.add(unitId), new Set())
        return
    }

    cache.fold(shuffleKey, (v: unknown[]) => v.concat(values), [])

    /////////// TRY TO SHUFFLE FROM DEFERRED LOGIC
    // needs to be executed per individual tag, because of applyKey
    deferred.registerIfNotExists(applyKey, () => {
        cache.set(applyKey, true)
        cache.over(waitingSetKey, (set: Set<string>) => set.delete(unitId), new Set())
    }, {
        priority: 65 /* is higher than ordering 35 */,
    })

    // needs to be executed once per fullKey
    deferred.registerIfNotExists(shuffleKey, () => {
        if (cache.get(waitingSetKey, new Set()).size > 0) {
            return
        }
        // will only go go beyong this point for the last set that becomes ready
        // because shuffling only needs to be done once

        cache.fold(shuffleKey, <V>(vs: V[]) => {
            const sortingIndices = memory.fold(shuffleKey, (vs: number[]) => {
                return strategy(vs, cache.get(shuffleKey, []).length)
            }, [])

            return sortWithIndices(vs, sortingIndices)
        }, [])
    })
}

const sequenceTemplate = <T extends {}>(
    makeKeywords: Eval<T, [string, string]>,
) => <V extends [...any[]]>(
    getValues: Eval<T, V[]>,
    sortIn: SortInStrategy,
): Eval<T, V[] | void> => (
    tag: TagData,
    internals: Internals<T>,
): V[] | void => {
    const [uid, sequenceId] = makeKeywords(tag, internals)
    return sequencer(uid, sequenceId, getValues(tag, internals), sortIn, internals)
}

const within = <T extends {}>({ fullKey, fullOccur }: TagData, _internals: Internals<T>): [string, string] => [`${fullKey}:${fullOccur}`, `${fullKey}:${fullOccur}`]
export const withinTag = sequenceTemplate(within)

const across = <T extends {}>({ fullKey, fullOccur }: TagData, _internals: Internals<T>): [string, string] => [`${fullKey}:${fullOccur}`, fullKey]
export const acrossTag = sequenceTemplate(across)
