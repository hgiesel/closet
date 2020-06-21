import type { FilterApi, TagData, Internals } from './types'

export const debugRecipe = () => (filterApi: FilterApi) => {
    const pathFilter = (_t: TagData, { path }: Internals) => path.join(':')

    filterApi.register('tagpath', pathFilter)
    filterApi.register('never', (() => {}))
    filterApi.register('empty', (() => ''))
    filterApi.register('key', (({ key }: TagData) => key))

    filterApi.register('memorytest', (({}, { memory }) => {
        const memoryTestKey = 'base:memorytest'
        return String(memory.fold(memoryTestKey, (v: number) => ++v, 0))
    }))
}
