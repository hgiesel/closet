import type { FilterApi, Tag } from './types'

export const debugRecipe = () => (filterApi: FilterApi) => {
    const pathFilter = ({path}: Tag) => path.join(':')

    filterApi.register('tagpath', pathFilter)
    filterApi.register('never', (() => {}))
    filterApi.register('empty', (() => ''))
    filterApi.register('key', (({ key }: Tag) => key))

    filterApi.register('memorytest', (({}, { memory }) => {
        const memoryTestKey = 'base:memorytest'
        return String(memory.fold(memoryTestKey, (v: number) => ++v, 0))
    }))
}
