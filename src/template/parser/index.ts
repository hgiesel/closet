import type { TagBuilderSettings } from './tagBuilder'
import type { ASTNode } from '../nodes'
import type { Delimiters } from './tokenizer/delimiters'
import type { NearleyLexer } from './grammar'
import type { Lexer } from 'moo'

import { Parser as NearleyParser, Grammar } from 'nearley'
import makeGrammar from './grammar'

import { TextNode, DocSeparatorNode } from '../nodes'
import { intersperse2d } from '../utils'
import { tagBuilder } from './tagBuilder'
import { makeLexer } from './tokenizer'
import { defaultDelimiters } from './tokenizer/delimiters'

const coreParse = (text: string, grammar: Grammar): ASTNode[][] => {
    const parser = new NearleyParser(grammar)

    try {
        const result = parser.feed(text).results
        return result
    }
    catch (e) {
        console.log(`Will default to Trivial Base Tag, due to error parsing text:`, e)
        return [[new TextNode(text)]]
    }
}

const mainParse = (text: string, grammar: Grammar): ASTNode[] => {
    const parsed = coreParse(text, grammar)

    if (parsed.length > 1) {
        console.log('Ambiguous template grammar')
    }

    return parsed[0]
}

const fragmentsParse = (textFragments: string[], grammar: Grammar): ASTNode[] => [...intersperse2d(
    textFragments.map((fragment: string) => mainParse(fragment, grammar)),
    new DocSeparatorNode(),
)]

export enum BaseDepth {
    Single = 1,
    Fragments = 2,
}

export class Parser {
    public delimiters: Delimiters
    public lexer: Lexer
    public grammar: Grammar

    protected tagBuilderSettings: TagBuilderSettings = [new Map(), new Map()]

    constructor(delimiters?: Delimiters) {
        this.delimiters = delimiters ?? defaultDelimiters
        this.lexer = makeLexer(this.delimiters)
        // Force silence moo/nearley inconsistency
        this.grammar = Grammar.fromCompiled(makeGrammar(this.lexer as unknown as NearleyLexer))
    }

    update(delimiters: Delimiters) {
        this.delimiters = delimiters ?? defaultDelimiters
        this.lexer = makeLexer(this.delimiters)
        // Force silence moo/nearley inconsistency
        this.grammar = Grammar.fromCompiled(makeGrammar(this.lexer as unknown as NearleyLexer))
    }

    parse(texts: string[]): ASTNode[] {
        tagBuilder.push(this.tagBuilderSettings, this.delimiters)
        return fragmentsParse(texts, this.grammar)
    }

    rawParse(text: string): ASTNode[] {
        tagBuilder.push(this.tagBuilderSettings, this.delimiters)
        return mainParse(text, this.grammar)
    }
}
