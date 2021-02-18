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


