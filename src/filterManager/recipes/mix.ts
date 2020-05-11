import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const mixRecipe = (keyword: string, separator: string) => (filterApi: FilterApi) => {
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

            const result = popped.join(separator)
            return result
        }

        if (!ready) {
            store.over(waitingSetKey, (s: Set<string>) => s.add(id), new Set())
            return
        }

        if (!num) {
            const result = shuffle(values[0]).join(separator)
            return result
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
