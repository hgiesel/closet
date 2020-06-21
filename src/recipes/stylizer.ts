import { id } from './utils'

type StringFunction = (v: string) => string
type StringPlusFunction = (v: string, i: number, ...a: any[]) => string

export class Stylizer {
    readonly separator: string
    readonly mapper: StringPlusFunction
    readonly postprocess: StringFunction

    constructor({
        separator = ', ',
        mapper = id as StringPlusFunction,
        postprocess = id as StringFunction,
    } = {}) {
        this.separator = separator
        this.mapper = mapper
        this.postprocess = postprocess
    }

    toStylizer({
        separator = this.separator,
        mapper = this.mapper,
        postprocess = this.postprocess,
    } = {}): Stylizer {
        return new Stylizer({
            separator: separator,
            mapper: mapper,
            postprocess: postprocess,
        })
    }

    stylize(input: string[], args: unknown[][] = []): string {
        return this.postprocess(input
            .flatMap((v, i) => this.mapper(v, i, ...args.map(arg => arg[i])))
            .join(this.separator)
        )
    }
}
