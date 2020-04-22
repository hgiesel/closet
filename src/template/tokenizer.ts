import moo from 'moo'

export const lexer = moo.states({
    main: {
        setstart: {
            match: '[[',
            push: 'inSet'
        },
        text: {
            match: /.+?(?=\[\[|$)/u,
            lineBreaks: true,
        },
    },
    inSet: {
        setstart: {
            match: '[[',
            push: 'inSet'
        },
        setend: {
            match: ']]',
            pop: 1,
        },
        argsep: '::',
        altsep: '||',
        intext: {
            match: /.+?(?=\[\[|\]\]|\|\||::)/u,
            lineBreaks: true,
        },
    },
})


export default lexer
