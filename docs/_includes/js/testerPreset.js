const TAG_START = /\[\[/u
const TAG_END = /\]\]/u
const ARG_SEP = /::/u
const ALT_SEP = /\|\|/u

//////////////////// codeCM

CodeMirror.defineSimpleMode('closet', {
    // The start state contains the rules that are intially used
    start: [
        // tagstart
        { regex: TAG_START, token: 'atom', push: 'key' },
        // text
        { regex: /[\s\S]+?(?=\[\[|$)/u },
    ],

    key: [
        // keyname
        { regex: /[a-zA-Z]+\d*/u, token: 'string' },
        // sep
        { regex: ARG_SEP, token: 'atom', next: 'intag' },
        // tagend
        { regex: TAG_END, token: 'atom', pop: true },
    ],

    intag: [
        // tagstart
        { regex: TAG_START, token: 'atom', push: 'key' },
        // tagend
        { regex: TAG_END, token: 'atom', pop: 1 },
        // argsep
        { regex: ARG_SEP, token: 'atom' },
        // altsep
        { regex: ALT_SEP, token: 'atom' },
        // valuestext
        { regex: /[\s\S]+?(?=\[\[|\]\]|\|\||::)/u },
    ],
})

const codeTA = document.getElementById('code')
const codeCM = CodeMirror.fromTextArea(codeTA, {
    mode: 'closet',
    viewportMargin: Infinity,
    matchBrackets: true,
    placeholder: 'Your template text...',
})

const sparams = new URLSearchParams(location.search)

if (sparams.has('text')) {
    codeCM.setValue(sparams.get('text').trim())
}

//////////////////// presetCM

const presetTA = document.getElementById('preset')
const presetCM = CodeMirror.fromTextArea(presetTA, {
    mode: { name: 'javascript', json: true },
    viewportMargin: Infinity,
    matchBrackets: true,
    placeholder: 'Define your preset options in JSON here...',
})

if (sparams.has('preset')) {
    let presetValue = null

    try {
        const tryParse = JSON.parse(sparams.get('preset'))
        presetValue = JSON.stringify(tryParse, null, 2)
    }
    catch {
        presetValue = '{}'
    }

    presetCM.setValue(presetValue)
}

//////////////////// reuse memory

const checkboxMemoization = document.getElementById('memoize-checkbox')

if (sparams.has('memory')) {
    checkboxMemoization.checked = sparams.get('memory').startsWith('t')
}

//////////////////// fitlerManager preset
if (sparams.has('setups')) {
    const setupIds = sparams.get('setups').split(',')

    for (const sid of setupIds) {
        const activeInput = document.querySelector(`input#input-${sid}`)

        if (activeInput) {
            activeInput.checked = true
        }
    }
}
