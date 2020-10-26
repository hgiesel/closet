import type { TagBuilderSettings } from './tagBuilder'
import type { ASTNode } from '../nodes'

import { Parser as NearleyParser } from 'nearley'

import { TextNode, DocSeparatorNode } from '../nodes'
import { intersperse2d } from '../utils'
import { tagBuilder } from './tagBuilder'

const coreParse = (text: string): ASTNode[][] => {
    const parser = new NearleyParser(templateGrammar)

    try {
        const result = parser.feed(text).results
        return result
    }
    catch (e) {
        console.error(`Error parsing text:`, e)
        console.info('Default to Trivial Base Tag')

        return [[new TextNode(text)]]
    }
}

const mainParse = (text: string): ASTNode[] => {
    const parsed = coreParse(text)

    if (parsed.length > 1) {
        console.error('Ambiguous template grammar')
    }

    return parsed[0]
}

const fragmentsParse = (textFragments: string[]): ASTNode[] => [...intersperse2d(
    textFragments.map(mainParse),
    new DocSeparatorNode(),
)]

export enum BaseDepth {
    Single = 1,
    Fragments = 2,
}

export class Parser {
    tagBuilderSettings: TagBuilderSettings = [new Map(), new Map()]
    tokenizer

    parse (texts: string[]): ASTNode[] {
        tagBuilder.push(this.tagBuilderSettings)
        return fragmentsParse(texts)
    }

    rawParse (text: string): ASTNode[] {
        tagBuilder.push(this.tagBuilderSettings)
        return mainParse(text)
    }
}
