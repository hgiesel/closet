import type {
    FilterApi,
} from '../filters'

import type { Tag } from '../../tags'

const debugRecipe = (filterApi: FilterApi) => {
    const pathFilter = ({path}: Tag) => path.join(':')

    filterApi.register('tagpath', pathFilter)
    filterApi.register('never', (() => {}))
    filterApi.register('empty', (() => ''))
    filterApi.register('key', (({key}: Tag) => key))

    filterApi.register('test', ((_t, { deferred }) => {
        deferred.registerIfNotExists('foobar', () => {
            console.log('foobar')
        }, 50)

        deferred.registerIfNotExists('mehbar', () => {
            console.log('mehbar')
        }, 20)

        deferred.registerIfNotExists('echbar', () => {
            console.log('echbar')
        }, 20)

        deferred.registerIfNotExists('gehbar', () => {
            console.log('gehbar')
        }, 200)

        return ''
    }))
}

export default debugRecipe
