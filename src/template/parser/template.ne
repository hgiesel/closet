@{%
import { tokenizer } from './tokenizer'
import { TagBuilder, TagInfoBuilder } from './tagBuilder'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
    joinText,
} from '../utils'

export const tagBuilder = new TagBuilder()
export const tagInfoBuilder = new TagInfoBuilder()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% ([[valuesRawRoot, firstLevelTags], eof]: any) => tagInfoBuilder.build(
    0,
    eof.offset,
    tagBuilder.build('base', valuesRawRoot),
    firstLevelTags,
)
%}

content -> _ (tag _):* {% ([first, rest]: any) => {
    const valuesRawRoot = first + rest.map(([tag, folBy]: any) => id(tag).join('') + folBy).join('') 
    const firstLevelTags = rest.map(id).map((v: any) => v[1])

    return [
        valuesRawRoot,
        firstLevelTags,
    ]
}
%}

tag -> %tagopen inner %tagclose {% ([tagopen, [keyname, valuesRaw, innerTags], tagclose]: any) => {
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
        tagInfoBuilder.build(
            tagopen.offset,
            tagclose.offset + TAG_CLOSE.length,
            tagBuilder.build(keyname, hasValuesRaw
                ? valuesRaw
                : null),
            innerTags.map((v: any) => v[1]),
        ),
    ]
}
%}

inner -> %keyname (%sep _values (tag _values):* ):? {% ([key,rest]: any) => {
    const keyName = key.value
    const valuesRaw = rest
        ? rest[1] + rest[2].map(([tag, vtxt]: any) => id(tag).join('') + vtxt).join('')
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
