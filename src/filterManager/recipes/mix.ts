import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const id = (v: string): string => v

const mixRecipe = (
    keyword: string,
    separator: string,
    mapper: (v: string) => string = id,
    postprocess: (v: string) => string = id,
) => (filterApi: FilterApi) => {
    const shuffle = (array: unknown[]) => {
        const result = array.slice(0)
        let currentIndex = array.length, temporaryValue = null, randomIndex = null

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            // And swap it with the current element.
            temporaryValue = result[currentIndex]
            result[currentIndex] = result[randomIndex]
            result[randomIndex] = temporaryValue
        }

        return result
    }

    const stylizeResult = (vs: string[]) => postprocess(vs.map(mapper).join(separator))

    const mixFilter = (
        {fullKey, num, fullOccur, values}: Tag,
        {store, deferred, ready}: Internals,
    ) => {
        const id = `${fullKey}:${fullOccur}`
        const waitingSetKey = `${fullKey}:waitingList`
        const applyKey = `${id}:apply`

        if (store.get(applyKey, false)) {
            const waitingSet = store.get(waitingSetKey, new Set()) as Set<string>
            if (waitingSet.size > 0) {
                return
            }

            const popped = []
            const possibleValues = store.get(fullKey, []) as unknown[]

            for (let x = 0; x < values[0].length; x++) {
                popped.push(possibleValues.pop())
            }

            return stylizeResult(popped)
        }

        if (!ready) {
            store.over(waitingSetKey, (s: Set<string>) => s.add(id), new Set())
            return
        }

        if (!num) {
            return stylizeResult(shuffle(values[0]) as string[])
        }

        store.fold(fullKey, (v: unknown[]) => v.concat(values[0]), [])

        // mix with num is ready for shuffling
        deferred.registerIfNotExists(applyKey, () => {
            store.set(applyKey, true)
            store.over(waitingSetKey, (set: Set<string>) => set.delete(id), new Set())
        })

        const mixKey = `${fullKey}:mix`
        deferred.registerIfNotExists(mixKey, () => {
            store.fold(fullKey, shuffle, [])
        })
    }

    filterApi.register(keyword, mixFilter as any)
}

export default mixRecipe
