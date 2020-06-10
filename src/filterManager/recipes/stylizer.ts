import { id } from './utils'

type StringFunction = (v: string) => string
type StringPlusFunction = (v: string, i: number) => string

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

    toFullStylizer({
        separator = this.separator,
        separatorOuter = '; ',
        mapper = this.mapper,
        mapperOuter = id,
        postprocess = this.postprocess,
    } = {}): FullStylizer {
        return new FullStylizer({
            separator: separator,
            mapper: mapper,
            separatorOuter: separatorOuter,
            mapperOuter: mapperOuter,
            postprocess: postprocess,
        })
    }

    stylize(input: string[], args?: number[]): string {
        return this.postprocess(input
            .map(args
                ? (v, i) => this.mapper(v, args[i])
                : (v, i) => this.mapper(v, i)
            )
            .join(this.separator)
        )
    }
}

export class FullStylizer extends Stylizer {
    readonly separatorOuter: string
    readonly mapperOuter: StringPlusFunction
    readonly postprocessOuter: StringFunction

    constructor({
        separator = ', ',
        mapper = id as StringPlusFunction,
        postprocess = id as StringFunction,

        separatorOuter = '; ',
        mapperOuter = id as StringPlusFunction,
        postprocessOuter = id as StringFunction,
    } = {}) {
        super({
            separator: separator,
            mapper: mapper,
            postprocess,
        })

        this.separatorOuter = separatorOuter
        this.mapperOuter = mapperOuter
        this.postprocessOuter = postprocessOuter
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

    stylizeFull(input: string[][], args?: number[], innerArgs?: number[][]): string {
        const innerResults = input.map((vs, i) => this.stylize(vs, innerArgs[i]))

        return this.postprocessOuter(innerResults
            .map(args
                ? (v, i) => this.mapperOuter(v, args[i])
                : (v, i) => this.mapperOuter(v, i)
            )
            .join(this.separatorOuter)
        )
    }
}

export const rawStylizer = new FullStylizer({
    separator: '||',
    separatorOuter: '::',
})
