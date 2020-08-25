import nearley from 'nearley'
import grammar from './grammar'

const tagSelectorGrammar = nearley.Grammar.fromCompiled(grammar)

export const parseTagSelector = (selector: string): void => {
    try {
        const parser = new nearley.Parser(tagSelectorGrammar)
        console.log('parser', selector, parser.feed(selector).results)
    }
    catch (e) {
        console.error('parsererror', e)
    }
}
