import moo from 'moo'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from '../utils'

// img tags are parsed via HTML (!)
export const tokenizer = moo.states({
    main: {
        tagopen: {
            match: TAG_OPEN,
            push: 'key',
        },
        text: {
            match: /[\s\S]+?(?=\[\[|$)/u,
            lineBreaks: true,
        },
    },

    key: {
        keyname: {
            match: /[a-zA-Z0-9%\/]+\d*/u,
        },
        sep: {
            match: ARG_SEP,
            next: 'intag',
        },
        tagclose: {
            match: TAG_CLOSE,
            pop: 1,
        },
    },

    intag: {
        tagopen: {
            match: TAG_OPEN,
            push: 'key',
        },
        tagclose: {
            match: TAG_CLOSE,
            pop: 1,
        },
        text: {
            match: /[\s\S]+?(?=\[\[|\]\])/u,
            lineBreaks: true,
        },
    },
})

export default tokenizer
