import moo from 'moo'

export const lexer = moo.states({
    main: {
        setstart: {
            match: '[[',
            push: 'inSet',
        },
        EOF: {
            match: /\$$/u,
        },
        text: {
            match: /[\s\S]+?(?=\[\[|\$$)/u,
            lineBreaks: true,
        },
    },
    inSet: {
        setstart: {
            match: '[[',
            push: 'inSet',
        },
        setend: {
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
