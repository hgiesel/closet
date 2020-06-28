import { id } from './utils'

type StringFunction = (v: string) => string
type StringPlusFunction = (v: string, i: number, ...a: any[]) => string

export class Stylizer {
    readonly separator: string
    readonly mapper: StringPlusFunction
    readonly processor: StringFunction

    constructor({
        separator = ', ',
        mapper = id as StringPlusFunction,
        processor = id as StringFunction,
    } = {}) {
        this.separator = separator
        this.mapper = mapper
        this.processor = processor
    }

    toStylizer({
        separator = this.separator,
        mapper = this.mapper,
        processor = this.processor,
    } = {}): Stylizer {
        return new Stylizer({
            separator: separator,
            mapper: mapper,
            processor: processor,
        })
    }

    stylize(input: string[], args: unknown[][] = []): string {
        return this.processor(input
            .flatMap((v, i) => this.mapper(v, i, ...args.map(arg => arg[i])))
            .join(this.separator)
        )
    }
}
