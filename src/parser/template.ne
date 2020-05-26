@{%
import {
    TagInfo,
} from '../tags'

import tokenizer from './tokenizer'
import TagMaker from './tagMaker'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from '../utils'
const joinText = ([vs]) => vs.map(v => v.value).join('')

export const tagMaker = new TagMaker()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% ([[valuesRawRoot,firstLevelTags],eof]) => new TagInfo(
    0,
    eof.offset,
    tagMaker.makeTag('base', valuesRawRoot),
    firstLevelTags,
    true,
)
%}

content -> _ (tag _):* {% ([first, rest]) => {
    const valuesRawRoot = first + rest.map(([tag, folBy]) => id(tag).join('') + folBy).join('') 
    const firstLevelTags = rest.map(id).map(v => v[1])

    return [
        valuesRawRoot,
        firstLevelTags,
    ]
}
%}

tag -> tagopen inner %tagclose {% ([startTokenIdx,[keyname, valuesRaw, innerTags],tagclose]) => {
    // NOTE empty string is also falsy!!!
    const hasValuesRaw = typeof valuesRaw === 'string'

    const valuesRawArray = [
        TAG_OPEN,
        hasValuesRaw
            ? `${keyname}${ARG_SEP}${valuesRaw}`
            : keyname,
        TAG_CLOSE,
    ]

    return [
        valuesRawArray,
        new TagInfo(
            startTokenIdx,
            tagclose.offset + TAG_CLOSE.length,
            tagMaker.makeTag(keyname, hasValuesRaw
                ? valuesRaw
                : null),
            innerTags.map(v => v[1]),
        ),
    ]
}
%}

tagopen -> %tagopen {% ([startToken]) => {
    tagMaker.signalTagOpen()
    return startToken.offset + startToken.value.length - TAG_OPEN.length 
}
%}

inner -> %keyname (%sep _values (tag _values):* ):? {% ([key,rest]) => {
    const keyName = key.value
    const valuesRaw = rest
        ? rest[1] + rest[2].map(([tag, vtxt]) => id(tag).join('') + vtxt).join('')
        : null

    const innerTags = rest
        ? rest[2].map(id)
        : []

    return [
        keyName,
        valuesRaw,
        innerTags,
    ]
}
%}

_values -> %valuestext:* {% joinText %}
_ -> %text:* {% joinText %}
