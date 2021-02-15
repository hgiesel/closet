import type { ProfunctorDict } from "./profunctors.js"
import { escapeRegExp } from "./utils.js"

const temp = (strings: string[], keys: number[]) => {
    return (values: string[]): string => {
        const dict = values[values.length - 1] || {}

        const result = [strings[0]]
        keys.forEach((key, index) => {
            const value = Number.isInteger(key)
                ? values[key]
                : dict[key]
            result.push(value, strings[index + 1])
        })

        return result.join('')
    }
}

// Setter
export const templatedRegex = ({
    before,
    after,
}: {
    before: string,
    after: string,
}) => {
    type TemplatedResult = [string[], (repls: string[]) => string]

    const getter = (text: string): TemplatedResult => { //[string[], => {
        const regex = new RegExp(`(${before})(.*?)(${after})`, 'gsu')

        const parts = []
        const matches = []
        let lastOffset = 0

        text.replace(regex, (match: string, before: string, inner: string, after: string, offset: number): string => {
            const part = text.substring(lastOffset, offset + before.length)

            parts.push(part)
            matches.push(inner)
            lastOffset = offset + match.length - after.length

            return ''
        })

        parts.push(text.substring(lastOffset))

        const indices = [...Array(matches.length).keys()];
        const templ = temp(parts, indices)

        return [matches, templ]
    }

    const setter = ([repls, templ]: TemplatedResult): string => {
        return templ(repls);
    }

    return (dict: ProfunctorDict, f0: (s: string[]) => string[]) => {
        const f1 = dict.first(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    }
}

export const templated = ({
    before,
    after,
}: {
    before: string,
    after: string,
}) => templatedRegex({
    before: escapeRegExp(before),
    after: escapeRegExp(after),
})
