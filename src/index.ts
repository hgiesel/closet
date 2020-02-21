import {
    parseProg,
} from './parsers'

import {
    parseList,
    // parseBool,
    // parseString,
} from './parsers/recursive'

import {
    parseSymbol,
} from './parsers/basic'


//////////////////////////

const btn = document.querySelector('#btn-parse')

btn.addEventListener('click', (_e) => {
    const input: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    if (!input) {
        return void(0)
    }

    console.log(input.value)

    const output = parseList.run(input.value)

    document
        .querySelector('#setlang-output')
        .innerHTML = JSON.stringify(output, null, 4)
})
