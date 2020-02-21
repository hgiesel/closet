import nearley from 'nearley'
import grammar from './genpar/slang'

import {
    execute,
} from './executor'

const parseCode = (code: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(code).results[0]

    console.log(p)

    return result
}

import lexer from './genpar/tokenizer'

globalThis.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
globalThis.lexer = lexer

//////////////////////////

const btn = document.querySelector('#btn-parse')

const display = function(htmlElement: HTMLDivElement, obj: Object) {
    htmlElement.innerHTML = JSON.stringify(obj, null, 4)
}

btn.addEventListener('click', (_e) => {
    // const templateElement: HTMLTextAreaElement | null = document.querySelector('#setlang-template')
    const codeElement: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    // if (!templateElement || !codeElement) {
    //     return void(0)
    // }

    // const templateField: HTMLDivElement = document.querySelector('div#setlang-template')
    // const templateOutput = getTemplate(templateElement.value)
    // display(templateField, templateOutput)

    const outputField: HTMLDivElement = document.querySelector('div#setlang-code')
    const codeOutput = parseCode(codeElement.value)
    display(outputField, codeOutput)

    const execField: HTMLDivElement = document.querySelector('div#setlang-executed')
    const executed = execute(codeOutput)
    display(execField, executed)
})
