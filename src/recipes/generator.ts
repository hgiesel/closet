import type { Registrar, TagData, Internals } from './types'

type NumberGenAlgorithm = (min: number, max: number, extra: number) => string

const maxTries = 10_000
const numberGenerator = (algorithm: NumberGenAlgorithm) => function*(min: number, max: number, extra: number, filter = false) {
  const banDomain = []

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

const intGenerator = numberGenerator((min, max, extra) => String((Math.floor(Math.random() * max) + min) * extra))
const realGenerator = numberGenerator((min, max, extra) => (Math.random() * (max - min) + min).toFixed(extra))

export const generateRecipe = ({
    tagname = 'gen',
    uniqueConstraintId = 'uniq',
} = {}) => (registrar: Registrar<{}>) => {

    const uniqConstraintPrefix = `gen:${uniqueConstraintId}`

    const generateFilter = ({ values, fullOccur, num }: TagData, { memory }: Internals<{}>) => {
        const [min = 0, max = 100, extra = 1] = values.length === 1
            ? [0, values[0], 1]
            : values

        const uniqueConstraint = Number.isInteger(num)
            ? `${uniqConstraintPrefix}:${fullOccur}:${num}`
            : `${uniqConstraintPrefix}:${fullOccur}`


        const result = memory.lazy(uniqueConstraint, 0)

        return { ready: true }
    }

    registrar.register(tagname, generateFilter)
}
