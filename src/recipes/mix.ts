const mixRecipe = (keyword, separator) => (filterApi) => {
    const shuffle = (array) => {
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

    const mixPrepareFilter = (
        {fullKey, key, idx, values},
        {store, filters, deferred, nextIteration},
    ) => {
        if (idx === null) {
            return shuffle(values[0]).join(separator)
        }

        if (store.has(fullKey)) {
            store.over(fullKey, v => v.concat(values[0]))
        }
        else {
            store.set(fullKey, values[0])
        }

        const replaceKey = `replaceFilter:${key}`
        if (!deferred.has(replaceKey)) {
            deferred.register(replaceKey, () => filters.register(key, mixApplyFilter))
        }

        const mixKey = `mix:${fullKey}`
        if (!deferred.has(mixKey)) {
            deferred.register(`mix:${fullKey}`, () => store.over(fullKey, shuffle))
        }

        nextIteration.activate()
    }

    const mixApplyFilter = (
        {fullKey, key, idx, values},
        {store},
    ) => {
        const popped = []
        for (let x = 0; x < values[0].length; x++) {
            popped.push(store.get(fullKey).shift())
        }

        return popped.join(separator)
    }

    filterApi.register(keyword, mixPrepareFilter)
}

export default mixRecipe
