// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var EOF: any;
declare var tagopen: any;
declare var tagclose: any;
declare var keyname: any;
declare var sep: any;
declare var valuestext: any;
declare var text: any;

import { tokenizer } from './tokenizer'
import { TagBuilder, TagInfoBuilder } from './tagBuilder'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from '../utils'
const joinText = ([vs]) => vs.map(v => v.value).join('')

export const tagBuilder = new TagBuilder()
export const tagInfoBuilder = new TagInfoBuilder()

interface NearleyToken {  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: tokenizer,
  ParserRules: [
    {"name": "start", "symbols": ["content", (tokenizer.has("EOF") ? {type: "EOF"} : EOF)], "postprocess":  ([[valuesRawRoot,firstLevelTags],eof]) => tagInfoBuilder.build(
            0,
            eof.offset,
            tagBuilder.build('base', valuesRawRoot),
            firstLevelTags,
        )
        },
    {"name": "content$ebnf$1", "symbols": []},
    {"name": "content$ebnf$1$subexpression$1", "symbols": ["tag", "_"]},
    {"name": "content$ebnf$1", "symbols": ["content$ebnf$1", "content$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "content", "symbols": ["_", "content$ebnf$1"], "postprocess":  ([first, rest]) => {
            const valuesRawRoot = first + rest.map(([tag, folBy]) => id(tag).join('') + folBy).join('') 
            const firstLevelTags = rest.map(id).map(v => v[1])
        
            return [
                valuesRawRoot,
                firstLevelTags,
            ]
        }
        },
    {"name": "tag", "symbols": [(tokenizer.has("tagopen") ? {type: "tagopen"} : tagopen), "inner", (tokenizer.has("tagclose") ? {type: "tagclose"} : tagclose)], "postprocess":  ([tagopen, [keyname, valuesRaw, innerTags], tagclose]) => {
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
                    innerTags.map(v => v[1]),
                ),
            ]
        }
        },
    {"name": "inner$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["tag", "_values"]},
    {"name": "inner$ebnf$1$subexpression$1$ebnf$1", "symbols": ["inner$ebnf$1$subexpression$1$ebnf$1", "inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "inner$ebnf$1$subexpression$1", "symbols": [(tokenizer.has("sep") ? {type: "sep"} : sep), "_values", "inner$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "inner$ebnf$1", "symbols": ["inner$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "inner$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "inner", "symbols": [(tokenizer.has("keyname") ? {type: "keyname"} : keyname), "inner$ebnf$1"], "postprocess":  ([key,rest]) => {
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
        },
    {"name": "_values$ebnf$1", "symbols": []},
    {"name": "_values$ebnf$1", "symbols": ["_values$ebnf$1", (tokenizer.has("valuestext") ? {type: "valuestext"} : valuestext)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_values", "symbols": ["_values$ebnf$1"], "postprocess": joinText},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (tokenizer.has("text") ? {type: "text"} : text)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": joinText}
  ],
  ParserStart: "start",
};

export default grammar;
