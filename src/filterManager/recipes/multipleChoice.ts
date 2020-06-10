import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { Stylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'

const defaultStylizer = new Stylizer({
    mapper: (v: string, t: number) => `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`,
})

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isActive: boolean): string => {
    return '[' + (
        values[1] ? values[1].join('||') : '...'
    ) + ']'
}

