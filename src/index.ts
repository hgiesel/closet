import {
    parseProg,
} from './parsers'

import {
    execute,
} from './executor'

import {
    // parseTemplate,
    // valueSetParser,
    parseTemplate,
} from './template'

//////////////////////////

const btn = document.querySelector('#btn-parse')

const display = function(htmlElement: HTMLDivElement, obj) {
    htmlElement.innerHTML = JSON.stringify(obj, null, 4)
}

btn.addEventListener('click', (_e) => {
    const templateElement: HTMLTextAreaElement | null = document.querySelector('#setlang-template')
    const codeElement: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    if (!templateElement || !codeElement) {
        return void(0)
    }

    const templateField: HTMLDivElement = document.querySelector('div#setlang-template')
    const templateOutput = parseTemplate.run(templateElement.value)
    display(templateField, templateOutput)

    const outputField: HTMLDivElement = document.querySelector('div#setlang-code')
    const codeOutput = parseProg.run(codeElement.value)
    display(outputField, codeOutput)

    const execField: HTMLDivElement = document.querySelector('div#setlang-executed')
    const executed = execute(codeOutput.result)
    display(execField, executed)
})
