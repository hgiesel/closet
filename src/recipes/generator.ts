import type { Registrar, WeakFilter, TagData, Internals } from './types'

type NumberGenAlgorithm = (min: number, max: number, extra: number) => string
type NumberGen = (min: number, max: number, extra: number, banDomain: string[], filter: boolean) => Generator<string, void, unknown>

const maxTries = 10_000
const numberGenerator = (
    algorithm: NumberGenAlgorithm,
): NumberGen => function*(
    min: number,
    max: number,
    extra: number,
    banDomain: string[],
    filter: boolean,
): Generator<string, void, unknown> {
  let tries = 0

  while (banDomain.length < max - min && tries < maxTries) {
    const randomValue = algorithm(min, max, extra)

    if (!filter || !banDomain.includes(randomValue)) {
      yield randomValue
      banDomain.push(randomValue)
    }

    tries++
  }
}

const intGenerator = numberGenerator(
    (min, max, extra) => String((Math.floor(Math.random() * max) + min) * extra)
)

const realGenerator = numberGenerator((min, max, extra) => (
    Math.random() * (max - min) + min).toFixed(extra)
)

export const generateTemplate = (generator: NumberGen) => ({
    tagname = 'gen',
    uniqueConstraintId = 'uniq',
} = {}) => <T extends {}>(registrar: Registrar<T>) => {
    const uniqConstraintPrefix = `gen:${uniqueConstraintId}`

    const generateFilter = ({ values, fullOccur, num }: TagData, { memory }: Internals<T>) => {
        const [min = 0, max = 100, extra = 1] = values.length === 1
            ? [0, values[0], 1]
            : values

        const uniqueConstraintId = Number.isInteger(num)
            ? `${uniqConstraintPrefix}:${num}`
            : uniqConstraintPrefix

        const generateId = `gen:${tagname}:${fullOccur}`

        const result = memory.lazy(generateId, (): string => {
            const gen = generator(
                min,
                max,
                extra,
                Number.isInteger(num)
                ? memory.get(uniqueConstraintId, [])
                : [],
                true,
            )

            const generated = gen.next()

            return generated.value || ''
        })

        return { result: result, ready: true }
    }

    registrar.register(tagname, generateFilter)
}

export const generateIntegerRecipe = generateTemplate(intGenerator)
export const generateRealRecipe = generateTemplate(realGenerator)
