import moo from 'moo'

// img tags are parsed via HTML (!)
export const lexer = moo.states({
    main: {
        tagstart: {
            match: '[[',
            push: 'inTag',
        },
        EOF: {
            match: /\$$/u,
        },
        text: {
            match: /[\s\S]+?(?=\[\[|\$$)/u,
            lineBreaks: true,
        },
    },
    inTag: {
        tagstart: {
            match: '[[',
            push: 'inTag',
        },
        tagend: {
            match: ']]',
            pop: 1,
        },
        argsep: '::',
        altsep: '||',
        intext: {
            match: /[\s\S]+?(?=::|\|\||\[\[|\]\])/u,
            lineBreaks: true,
        },
    },
})

export default lexer
