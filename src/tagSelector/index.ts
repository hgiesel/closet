import nearley from 'nearley'
import grammar from './grammar'

export type TagPredicate = (key: string, num: number, fullOccur: number) => boolean

const tagSelectorGrammar = nearley.Grammar.fromCompiled(grammar)

export const parseTagSelector = (selector: string): TagPredicate => {
    const parser = new nearley.Parser(tagSelectorGrammar)

    try {
        const parsed = parser.feed(selector).results

        if (parsed.length > 1) {
            console.error('Tag selector is ambiguous: ', selector, parsed)
        }

        return parsed[0]
    }
    catch (e) {
        console.error('Tag selector failed to parse: ', e)
        return () => false
    }
}
