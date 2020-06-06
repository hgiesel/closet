export const id = <T>(v: T): T => v
export const keyPattern = /^([a-zA-Z]+)([0-9]*)$/

export const shuffle = <T>(array: T[]): T[] => {
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

export const sortWithIndices = <T>(items: T[], indices: number[]): T[] => {
    const result = []

    for (const idx of indices) {
        const maybeItem = items[idx]

        if (maybeItem) {
            result.push(maybeItem)
        }
    }

    if (indices.length < items.length) {
        const remainingItemIndices: number[] = Array.from(
            new Array(items.length - indices.length),
            (_x, i) => i + indices.length
        )

        for (const idx of remainingItemIndices) {
            result.push(items[idx])
        }
    }

    return result
}

export const topUpSortingIndices = (indices: number[], toLength: number): number[] => {
    if (indices.length >= toLength) {
        // indices already have sufficient length
        return indices
    }

    const newIndices = Array.from(
        new Array(toLength - indices.length),
        (_x: undefined, i: number) => i + indices.length,
    )

    const result = [...indices]
    newIndices.forEach(
        (newIndex: number) => result.splice(
            Math.floor(Math.random() * (result.length + 1)) /* possible insertion positions */,
            0,
            newIndex,
        )
    )

    return result
}

export const toNumbers = (vs: string[]) => {
    return vs
        .map((v: string) => Number(v))
        .filter((v: number) => !isNaN(v))
}

export const allowCommaStyle = (values: string[][], valuesRaw: string): string[] => {
    return valuesRaw.includes(',')
        ? valuesRaw.split(',')
        : values[0]
}
