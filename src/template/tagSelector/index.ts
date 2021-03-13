import { Grammar, Parser } from "nearley";
import grammar from "./grammar";

import { keySeparationPattern } from "../parser/tagBuilder";

type TagPredicate = (
    key: string,
    num: number | null | undefined,
    occur: number | null,
) => boolean;

const tagPredicateGrammar = Grammar.fromCompiled(grammar);

const parseTagSelector = (selector: string): TagPredicate => {
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

    const parser = new Parser(tagPredicateGrammar);

    try {
        const parsed = parser.feed(selector).results;

        if (parsed.length > 1) {
            console.log("Tag selector is ambiguous: ", selector, parsed);
        }

        return parsed[0];
    } catch (e) {
        console.log("Tag selector failed to parse: ", e);
        return () => false;
    }
};

export class TagSelector {
    predicate: TagPredicate;

    protected constructor(selector: string) {
        this.predicate = parseTagSelector(selector);
    }

    static make(selector: string) {
        return new TagSelector(selector);
    }

    check(key: string, num: number | null, occur: number | null = null) {
        return this.predicate(key, num, occur);
    }

    checkFullKey(key: string, occur: number | null = null) {
        return this.predicate(key, undefined, occur);
    }

    checkTagIdentifier(identifier: string) {
        const match = identifier.match(keySeparationPattern);

        if (!match) {
            return false;
        }

        const key = match[1];
        const num = match[2].length > 0 ? Number(match[2]) : null;
        const occur = match[3] ? Number(match[3]) : null;

        return this.predicate(key, num, occur);
    }
}
