import parseTemplate from './template'
import parseCode from './genpar'
import execute from './executor'

import { toString } from './executor/coerce'

const btn = document.querySelector('#btn-parse')
const templateElement: HTMLTextAreaElement = document.querySelector('#setlang-template')
const codeElement: HTMLTextAreaElement = document.querySelector('#setlang-code')
const templateField: HTMLDivElement = document.querySelector('div#setlang-template')
const codeField: HTMLDivElement = document.querySelector('div#setlang-executed')
const outputField: HTMLDivElement = document.querySelector('div#setlang-code')

const display = function(htmlElement: HTMLDivElement, obj: string) {
    htmlElement.innerHTML = obj
}

btn.addEventListener('click', (_e) => {
    const templateOutput = parseTemplate(templateElement.value)
    display(templateField, templateOutput)

    console.time('code parse')
    const codeOutput = parseCode(codeElement.value)
    console.timeEnd('code parse')
    display(outputField, JSON.stringify(codeOutput, null, 4))

    try {
        console.time('code execute')
        const executed = execute(codeOutput, new Map())
        display(codeField, toString(executed).value)
    }
    catch (e) {
        display(codeField, e.toString())
        throw e
    }
    finally {
        console.timeEnd('code execute')
    }
})
