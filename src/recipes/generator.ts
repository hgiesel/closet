import type { Registrar, WeakFilter, TagNode, Internals } from './types'

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

const intAlgorithm: NumberGenAlgorithm = (min, max, extra) => String((Math.floor(Math.random() * max) + min) * extra)
const realAlgorithm: NumberGenAlgorithm = (min, max, extra) => (Math.random() * (max - min) + min).toFixed(extra)

export const generateTemplate = (algorithm: NumberGenAlgorithm, defaultExtra: number) => ({
    tagname = 'gen',
    uniqueConstraintId = 'uniq',
    separator = { sep: ',' },
} = {}) => <T extends {}>(registrar: Registrar<T>) => {
    const generator = numberGenerator(algorithm)
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

        return { ready: true, result: result }
    }

    registrar.register(tagname, generateFilter, { separators: [separator] })
}

export const generateIntegerRecipe = generateTemplate(intAlgorithm, 1)
export const generateRealRecipe = generateTemplate(realAlgorithm, 2)
