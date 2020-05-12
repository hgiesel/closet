export const shuffle = (array: unknown[]) => {
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

export const id = <T>(v: T): T => v

export const allowCommaStyle = (values: string[][], valuesRaw: string): number[] => {
    const vs = valuesRaw.includes(',')
        ? valuesRaw.split(',')
        : values[0]

    return vs
        .map((v: string) => Number(v))
        .filter((v: number) => !isNaN(v))
}
