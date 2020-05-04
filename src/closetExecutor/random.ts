import type {
    Slang,
    SlangVector,
    SlangNumber,
} from '../types'

import {
    mkNumber,
    mkVector,
} from '../constructors'

export const rand = ([...props]: [...SlangNumber[]]): SlangNumber => {
    switch (props.length) {
        case 0:
            return mkNumber(Math.random())
        case 1:
            return mkNumber(Math.random() * props[0].value)
        case 2:
        default:
            return mkNumber(props[0].value + Math.random() * props[1].value)
    }
}

export const randInt = ([...props]: [...SlangNumber[]]): SlangNumber => {
    switch (props.length) {
        case 0:
            return mkNumber(0)
        case 1:
            return mkNumber(Math.floor(Math.random() * props[0].value))
        case 2:
        default:
            return mkNumber(Math.floor(props[0].value + Math.random() * props[1].value))
    }
}

export const randNth = ([vec]: [SlangVector]): Slang => {
    const randomIndex = Math.floor(Math.random() * vec.members.length)

    return vec.members[randomIndex]
}

const shuffleArray = (array: any[]): void => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const safeShuffle = (array: any[]): any[] => {
    const result = []
    const indexArray = [...Array(array.length).keys()]

    shuffleArray(indexArray)

    for (const idx of indexArray) {
        result.push(array[idx])
    }

    return result
}

export const shuffle = ([vec]: [SlangVector]): SlangVector => {
    return mkVector(safeShuffle(vec.members))
}
