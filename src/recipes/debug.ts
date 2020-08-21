import type { Registrar, TagData, Internals } from './types'

export const debugRecipe = () => <T extends {}>(registrar: Registrar<T>) => {
    const pathFilter = (_t: TagData, { path }: Internals<T>) => path.join(':')

    registrar.register('tagpath', pathFilter)
    registrar.register('never', (() => {}))
    registrar.register('empty', (() => ''))
    registrar.register('key', (({ key }: TagData) => key))

    registrar.register('stopIteration', ({ values }: TagData, { filters }: Internals<T>) => {
        const endAtIteration = Number(values)
        const savedBase = filters.getOrDefault('base')

        filters.register('base', (tag: TagData, internals: Internals<T>) => {
            return internals.iteration >= endAtIteration
                ? tag.valuesText ?? ''
                : savedBase(tag, internals)
        })

        return { ready: true }
    })

    registrar.register('memorytest', (({}, { memory }: Internals<T>) => {
        const memoryTestKey = 'base:memorytest'
        return String(memory.fold(memoryTestKey, (v: number) => ++v, 0))
    }))
}
