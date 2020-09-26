import { Grammar, Parser } from 'nearley'
import grammar from './grammar'

export type TagPredicate = (key: string, num: number | null | undefined, occur: number | null) => boolean

const tagSelectorGrammar = Grammar.fromCompiled(grammar)

export const parseTagSelector = (selector: string): TagPredicate => {
    /**
     * `TagPredicate` can be used in three ways:
     * 1. pred(key, num, fullOccur)
     * 2. pred(fullKey, undefined, occur)
     * 3. pred(fullKey, undefined, fullOccur)
     *
     * all of the following combinations uniquely identifies tags:
     * 1. (key, num, fullOccur)
     * 2. (fullKey, fullOccur)
     * 3. (fullKey, occur)
     *
     * passing in null for `occur` means to ignore the occurrence numbers (always true)
     */

    const parser = new Parser(tagSelectorGrammar)

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
