import moo from 'moo'

// img tags are parsed via HTML (!)
export const lexer = moo.states({
    main: {
        tagstart: {
            match: '[[',
            push: 'key',
        },
        EOF: {
            match: /\$$/u,
        },
        text: {
            match: /[\s\S]+?(?=\[\[|\$$)/u,
            lineBreaks: true,
        },
    },
    key: {
        keyname: {
            match: /[a-zA-Z]+\d*/u,
        },
        sep: {
            match: '::',
            next: 'intag',
        },
        tagend: {
            match: ']]',
            pop: 1,
        },
    },
    intag: {
        tagstart: {
            match: '[[',
            push: 'key',
        },
        tagend: {
            match: ']]',
            pop: 1,
        },
        valuestext: {
            match: /[\s\S]+?(?=\[\[|\]\])/u,
            lineBreaks: true,
        },
    },
})

export default lexer
