import type { Registrar, TagNode, Internals } from './types'

type NumberGenAlgorithm = () => number
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
        console.log('banned', randomValue, banDomain)

        if (!filter || !banDomain.includes(randomValue)) {
            yield randomValue
            banDomain.push(randomValue)
        }

        tries++
    }
}

export const intAlgorithm = (min: number, max: number): NumberGenAlgorithm => () => min + Math.floor(Math.random() * (max - min))
export const intOutput = (value: number, extra: number) => String(value * extra)
export const intStop = (min: number, max: number) => (banDomain: number[]) => banDomain.length >= max - min

const realAlgorithm = (min: number, max: number): NumberGenAlgorithm => () => min + Math.random() * (max - min)
const realOutput = (value: number, extra: number) => value.toFixed(extra)

export const generateTemplate = (
    algorithm: (min: number, max: number) => NumberGenAlgorithm,
    outputAlgorithm: (value: number, extra: number) => string,
    defaultExtra: number,
) => ({
    tagname = 'gen',
    uniqueConstraintId = 'uniq',
    separator = { sep: ',' },
} = {}) => <T extends {}>(registrar: Registrar<T>) => {
    const uniqConstraintPrefix = `gen:${uniqueConstraintId}`

    const generateFilter = ({ values, fullOccur, num }: TagNode, { memory }: Internals<T>) => {
        const [min = 1, max = 100, extra = defaultExtra] = values.length === 1
            ? [1, Number(values[0]), defaultExtra]
            : values.map(Number)

        const uniqueConstraintId = Number.isInteger(num)
            ? `${uniqConstraintPrefix}:${num}`
            : uniqConstraintPrefix

        const generateId = `gen:${tagname}:${fullOccur}`

        const result = memory.lazy(generateId, (): string => {
            const gen = numberGenerator(
                algorithm(min, max),
                true,
                Number.isInteger(num)
                    ? memory.get(uniqueConstraintId, [])
                    : [],
            )

            const generated = gen.next()

            return generated.done
                ? ''
                : outputAlgorithm(generated.value as number, extra)
        })

        return { ready: true, result: result }
    }

    registrar.register(tagname, generateFilter, { separators: [separator] })
}

export const generateIntegerRecipe = generateTemplate(intAlgorithm, intOutput, 1)
export const generateRealRecipe = generateTemplate(realAlgorithm, realOutput, 2)
