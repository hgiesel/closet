import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

import {
    shuffle,
    id,
} from './utils'

const mixRecipe = (
    keyword: string,
) => (filterApi: FilterApi) => {
    const intFilter = (
        {values, valuesRaw}: Tag,
    ) => {
    }

    const realFilter = (
        {}
    ) => {
    }

    filterApi.register(keyword, intFilter)
    filterApi.register(keyword, realFilter)
}

export default mixRecipe
