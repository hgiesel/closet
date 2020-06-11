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

    stylizeFull(input: string[][], args: unknown[][][] = [], argsOuter: unknown[][] = []): string {
        const innerResults = input.map((vs, i) => this.stylize(vs, args[i]))

        return this.postprocessOuter(innerResults
            .flatMap((v, i) => this.mapperOuter(v, i, argsOuter.map(arg => arg[i])))
            .join(this.separatorOuter)
        )
    }
}

export const rawStylizer = new FullStylizer({
    separator: '||',
    separatorOuter: '::',
})
