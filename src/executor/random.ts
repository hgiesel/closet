import type {
    Slang,
    SlangVector,
    SlangNumber,
} from '../types'

import {
    mkNumber,
} from '../constructors'

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const shuffle = ([vec]: [SlangVector]): SlangVector => {

}
 
export const randNth = ([vec]: [SlangVector]): Slang => {
}

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

export const randInt = ([first, ...props]: [SlangNumber, ...SlangNumber[]]): SlangNumber => {
    switch (props.length) {
        case 0:
            return mkNumber(Math.random() * first.value)
        case 1:
        default:
            return mkNumber(first.value + Math.random() * props[0].value)
    }
}
