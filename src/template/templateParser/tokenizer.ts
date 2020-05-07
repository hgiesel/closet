import moo from 'moo'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../../templateTypes'

// img tags are parsed via HTML (!)
export const lexer = moo.states({
    main: {
        tagstart: {
            match: TAG_START,
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
            match: ARG_SEP,
            next: 'intag',
        },
        tagend: {
            match: TAG_END,
            pop: 1,
        },
    },

    intag: {
        tagstart: {
            match: TAG_START,
            push: 'key',
        },
        tagend: {
            match: TAG_END,
            pop: 1,
        },
        valuestext: {
            match: /[\s\S]+?(?=\[\[|\]\])/u,
            lineBreaks: true,
        },
    },
})

export default lexer
