import type { Registrar, TagNode, Internals } from './types'

type NumberGenAlgorithm = () => number
// type NumberGen = (min: number, max: number, extra: number, banDomain: string[], filter: boolean) => Generator<string, void, unknown>

const maxTries = 10_000
const numberGenerator = function*(
    gen: NumberGenAlgorithm,
    filter: boolean,
    banDomain: number[] = [],
    restrict: (banDomain: number[]) => boolean = () => true,
): Generator<number, void, unknown> {
    let tries = 0

    while (restrict(banDomain) && tries < maxTries) {
        const randomValue = gen()

        if (!filter || !banDomain.includes(randomValue)) {
            yield randomValue
            banDomain.push(randomValue)
        }

        tries++
    }
}

export const intAlgorithm = (min: number, max: number): NumberGenAlgorithm => () => min + Math.floor(Math.random() * (max - min))
const intOutput = (value: number, extra: number) => String(value * extra)

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
