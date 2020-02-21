import {
    parseProg,
} from './types/prog'

import {
    parseBool,
} from './types/bool'

import {
    parseString,
} from './types/string'


//////////////////////////

const btn = document.querySelector('#btn-parse')

btn.addEventListener('click', (_e) => {
    const input: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    if (!input) {
        return void(0)
    }

    console.log(input.value)

    const output = parseProg.run(input.value)

    document
        .querySelector('#setlang-output')
        .innerHTML = JSON.stringify(output, null, 4)
})
