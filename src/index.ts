import {
    parseProg,
} from './parsers'

import {
    parseList,
    // parseBool,
    parseMap,
    keyValues,
} from './parsers/recursive'

import {
    parseSymbol,
} from './parsers/basic'

import {
    execute,
} from './executor'


//////////////////////////

const btn = document.querySelector('#btn-parse')

const display = function(htmlElement, obj) {
    htmlElement.innerHTML = JSON.stringify(obj, null, 4)
}

btn.addEventListener('click', (_e) => {
    const input: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    if (!input) {
        return void(0)
    }

    const outputField = document.querySelector('#setlang-output')
    const output = parseProg.run(input.value)
    display(outputField, output)

    const execField = document.querySelector('#setlang-executed')
    const executed = execute(output.result)
    display(execField, executed)
})
