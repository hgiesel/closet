import type { TagData, Registrar, Internals } from './types'

import { keyPattern } from './utils'
import { ValueStore } from './valueStore'

class NumStore extends ValueStore<number> {
    set(key: string, num: number | null, occur: number | null, value = 0): void {
        const mapKey = this.getKey(key, num, occur)

        this.map.set(mapKey, value)
    }

    inc(key: string, num: number | null, occur: number | null, inc = 1): void {
        const mapKey = this.getKey(key, num, occur)

        this.map.set(mapKey, this.get(key, num, occur) + inc)
    }

    dec(key: string, num: number | null, occur: number | null, dec = 1): void {
        const mapKey = this.getKey(key, num, occur)

        this.map.set(mapKey, this.get(key, num, occur) + dec)
    }
}

const activateFilterTemplate = (
    activateId: string,
    operation: (key: string, occur: number | null, num: number | null) => (a: ActivateMap) => void,
) => (tag: TagData, { cache }: Internals<{}>) => {
    const commands = tag.values

    commands.forEach((val: string) => {
        const [fullKey, occur] = val.split(':')
        const [, key, num] = fullKey.match(keyPattern)

        const theOccur = occur
            ? Number(occur)
            : null

        const theNum = num.length === 0
            ? null
            : Number(num)

        cache.over(`${key}:${activateId}`, operation(key, theNum, theOccur), new ActivateMap())
    })

    return ''
}

// const activateDataOptions = { separators: [','] }

// export const activateRecipe = ({
//     tagname,
//     activateId = 'activate',
// }) => (filterApi: Registrar<{}>) => {
//     filterApi.register(tagname, activateFilterTemplate(
//         activateId,
//         (key, num, occur) => (activateMap) => {
//             activateMap.on(key, num, occur)
//         }
//     ), activateDataOptions)
// }

// export const deactivateRecipe = ({
//     tagname,
//     activateId = 'activate',
// }) => (filterApi: Registrar<{}>) => {
//     filterApi.register(tagname, activateFilterTemplate(
//         activateId,
//         (key, num, occur) => (activateMap) => {
//             activateMap.off(key, num, occur)
//         }
//     ), activateDataOptions)
// }

// export const toggleRecipe = ({
//     tagname,
//     activateId = 'activate',
// }) => (filterApi: Registrar<{}>) => {
//     filterApi.register(tagname, activateFilterTemplate(
//         activateId,
//         (key, num, occur) => (activateMap) => {
//             activateMap.toggle(key, num, occur)
//         }
//     ), activateDataOptions)
// }
