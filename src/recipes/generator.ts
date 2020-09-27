export type NumberGenAlgorithm = () => number
// type NumberGen = (min: number, max: number, extra: number, banDomain: string[], filter: boolean) => Generator<string, void, unknown>

const maxTries = 1_000

export const numberGenerator = function*(
    gen: NumberGenAlgorithm,
    filter: boolean,
    banDomain: number[] = [],
    prematureStop: (banDomain: number[]) => boolean = () => false,
): Generator<number, void, unknown> {
    let tries = 0

    while (!prematureStop(banDomain) && tries < maxTries) {
        const randomValue = gen()

        if (!banDomain.includes(randomValue)) {
            if (filter) {
                banDomain.push(randomValue)
            }

            yield randomValue
        }

        tries++
    }
}

export const intAlgorithm = (min: number, max: number): NumberGenAlgorithm => () => min + Math.floor(Math.random() * (max - min))
export const intOutput = (value: number, extra: number) => String(value * extra)
export const intStop = (min: number, max: number) => (banDomain: number[]) => banDomain.length >= max - min

export const realAlgorithm = (min: number, max: number): NumberGenAlgorithm => () => min + Math.random() * (max - min)
export const realOutput = (value: number, extra: number) => value.toFixed(extra)
