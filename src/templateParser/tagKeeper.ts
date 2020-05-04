import {
    tagMaker,
    mkTagInfo,
} from '../templateTypes'

///// Example Usage
// const gen = setKeeper()
// gen.next()
//
// console.log(gen.next([5]))
// console.log(gen.next([8]))
// console.log(gen.next([-12, elems]))
// console.log(gen.next([30]))
// console.log(gen.next([-35, elems]))
// console.log(gen.next([-55, elems]))
//
// gen.next('stop')
//
const tagKeeper = function*() {
    const tm = tagMaker()
    const tagInfos = []

    const getTagInfo = (idxs: number[]) => {
        let reference = tagInfos

        for (const id of idxs) {
            reference = reference[id].innerTags
        }

        return reference
    }

    const tagStack: number[] = []
    let nextLevel = 0

    while (true) {
        let value = yield tagStack

        if (value === 'stop') /* stop */{
            return tagInfos
        }

        else if (value[0] >= 0) /* start */ {
            const startIndex = value[0] - 2 /* two delimiter characters */
            getTagInfo(tagStack).push(mkTagInfo(startIndex))
            tagStack.push(nextLevel)

            nextLevel = 0
        }

        else /* end */ {
            const endIndex = Math.abs(value[0]) + 2 /* two delimiter characters */
            const poppedLevel = tagStack.pop()
            const foundTag = getTagInfo(tagStack)[poppedLevel]
            foundTag.end = endIndex
            foundTag.tag = tm.mkTag(value[1][0], value[1].slice(1))

            nextLevel = poppedLevel + 1
        }
    }
}

export const initTagKeeper = () => {
    let tk = tagKeeper()
    tk.next()

    const stop = () => {
        const result = tk.next('stop')

        tk = tagKeeper()
        tk.next()

        return result
    }

    const startToken = (offset) => {
        return tk.next([offset])
    }

    const endToken = (offset, tag) => {
        return tk.next([-offset, tag])
    }

    return {
        stop: stop,
        startToken: startToken,
        endToken: endToken,
    }
}

export default initTagKeeper
