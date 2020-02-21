import nearley from 'nearley'
import grammar from './genpar/slang'

import execute from './executor'
import lexer from './genpar/tokenizer'

import {
    toString,
} from './executor/coerce'

const parseCode = (code: string) => {
    const p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    const result = p.feed(code).results[0]

    console.log(p)

    return result
}

globalThis.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
globalThis.lexer = lexer

//////////////////////////

const btn = document.querySelector('#btn-parse')

const display = function(htmlElement: HTMLDivElement, obj: string) {
    htmlElement.innerHTML = obj
}

btn.addEventListener('click', (_e) => {
    // const templateElement: HTMLTextAreaElement | null = document.querySelector('#setlang-template')
    const codeElement: HTMLTextAreaElement | null = document.querySelector('#setlang-code')

    // if (!templateElement || !codeElement) {
    //     return void(0)
    // }

    // const templateField: HTMLDivElement = document.querySelector('div#setlang-template')
    // const templateOutput = Array.from(lexer.reset(codeElement.value)) // getTemplate(templateElement.value)
    // display(templateField, templateOutput)

    const outputField: HTMLDivElement = document.querySelector('div#setlang-code')
    console.time('code parse')
    const codeOutput = parseCode(codeElement.value)
    console.timeEnd('code parse')
    display(outputField, JSON.stringify(codeOutput, null, 4))

    const execField: HTMLDivElement = document.querySelector('div#setlang-executed')

    try {
        console.time('code execute')
        const executed = execute(codeOutput, new Map())
        display(execField, toString(executed).value)
    }
    catch (e) {
        display(execField, e.toString())
        throw e
    }
    finally {
        console.timeEnd('code execute')
    }
})
