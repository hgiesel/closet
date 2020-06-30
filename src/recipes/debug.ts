import type { Registrar, TagData, Internals } from './types'

export const debugRecipe = () => (registrar: Registrar<{}>) => {
    const pathFilter = (_t: TagData, { path }: Internals<{}>) => path.join(':')

    registrar.register('tagpath', pathFilter)
    registrar.register('never', (() => {}))
    registrar.register('empty', (() => ''))
    registrar.register('key', (({ key }: TagData) => key))

    registrar.register('memorytest', (({}, { memory }) => {
        const memoryTestKey = 'base:memorytest'
        return String(memory.fold(memoryTestKey, (v: number) => ++v, 0))
    }))
}
