@{%
import { tagSelectorTokenizer } from './tokenizer'
import { keySeparationPattern } from '../template/parser/tagBuilder'
%}

@preprocessor typescript
@lexer tagSelectorTokenizer

#################################

start -> allStar {% id %}
       | pattern {% id %}

allStar -> %allStar {% () => () => true %}

pattern -> key num occur {%
    ([keyPattern, numPred, occurPred]) => (key: string, num: number | null | undefined, fullOccur: number | null) => {
        if (typeof num === 'undefined') {
            const match = key.match(keySeparationPattern)

            if (!match) {
                return false
            }

            const actualKey = match[1]

            const maybeNum = Number(match[2])
            const actualNum = Number.isNaN(maybeNum)
                ? null
                : maybeNum 

            return keyPattern.test(actualKey) && numPred(actualNum) && occurPred(fullOccur)
        }
        else {
            return keyPattern.test(key) && numPred(num) && occurPred(fullOccur)
        }
    }
%}

key -> (keyComps):+ {% ([vals]) => new RegExp(`^${vals.join('')}$`, 'u') %}

keyComps -> mixedText {% id %}
          | escapeseq {% id %}
          | keyGroup {% id %}

mixedText -> %text {% ([val]) => val.value %}
           | %star {% () => '.*' %}
           | %slash {% () => '\\\\' %}

escapeseq -> %escapeseq {% ([val]) => val.value %}

keyGroup -> %groupOpen keyGroupInner %groupClose {%
    ([,inner]) => inner.join('')
%}

keyGroupInner -> keyGroupItem (%groupAlternative keyGroupItem):* {%
    ([val, alts]) => [val, ...alts.map((alt: any) => alt.value)]
%}

keyGroupItem -> (mixedText):* {%
    ([vals]) => vals.join('')
%}

#################################

num -> (numPredicate):? {%
    ([pred]) => pred ? pred[0] : (num: number | null) => num === null
%}

numPredicate -> numDigits {% id %}
              | numStar {% id %}
              | numGroup {% id %}

numDigits -> %numDigits {% ([val]) => (num: number | null) => num === Number(val.value) %}

numStar -> %numStar {% () => (num: number | null) => true %}

numGroup -> %groupOpen numGroupInner %numGroupClose {%
    ([,preds]) => (num: number | null) => preds.reduce((accu: boolean, pred: any) => accu || pred(num), false)
%}

numGroupInner -> numGroupItem (%groupAlternative numGroupItem):* {%
    ([first,rest]) => [
        first,
        ...rest.map(([,item]: any) => item),
    ]
%}

numGroupItem -> (numGroupPredicate):? {%
    ([pred]) => pred ? pred[0] : (num: number | null) => num === null
%}

numGroupPredicate -> digits {% id %}
                   | range {% id %}
                   | multiple {% id %}

digits -> %digits {% ([val]) => (num: number | null) => num === Number(val.value) %}

range -> bounded {% id %}
       | leftBounded {% id %}
       | rightBounded {% id %}

bounded -> %digits %rangeSpecifier %digits {%
    ([leftVal,,rightVal]) => (num: number | null) => (
        typeof num === 'number' &&
        Number(leftVal.value) <= num &&
        num <= Number(rightVal.value)
    )
%}

leftBounded -> %digits %rangeSpecifier {%
    ([val]) => (num: number) => typeof num === 'number' && Number(val.value) <= num
%}

rightBounded -> %rangeSpecifier %digits {%
    ([,val]) => (num: number) => typeof num === 'number' && num <= Number(val.value)
%}

multiple -> %digits %multiplierSeq %digits {%
    ([mult,,base]) => (num: number) => (num - base) % mult === 0
%}

#################################

occur -> (%occurSep occurPredicate):? {%
    ([pred]) => pred
        ? (occur: number | null) => occur === null ? true : pred[1](occur)
        : () => true
%}

occurPredicate -> numDigits {% id %}
                | numStar {% id %}
                | occurGroup {% id %}

occurGroup -> %groupOpen occurGroupInner %groupClose {%
    ([,preds]) => (num: number) => preds.reduce((pred: any, accu: boolean) => accu || pred(num), false)
%}

# no empty predicate possible for occur (can't be null)
# so we can skip numGroupItem
occurGroupInner -> numGroupPredicate (%groupAlternative numGroupPredicate):* {%
    ([first,rest]) => [
        first,
        ...rest.map(([,item]: any) => item),
    ]
%}
