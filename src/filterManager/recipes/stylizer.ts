import {
    id,
} from './utils'

type StringFunction = (v: string) => string

export class Stylizer {
    private readonly separator: string
    private readonly separatorOuter: string
    private readonly mapper: StringFunction
    private readonly mapperOuter: StringFunction
    private readonly postprocess: StringFunction

    constructor({
        separator = ', ',
        separatorOuter = '; ',
        mapper = id as StringFunction,
        mapperOuter = id as StringFunction,
        postprocess = id as StringFunction,
    } = {}) {
        this.separator = separator
        this.separatorOuter = separatorOuter
        this.mapper = mapper
        this.mapperOuter = mapperOuter
        this.postprocess = postprocess
    }

    stylize(input: string[][]): string {
        return this.postprocess(input
            .map(vs => vs.map(this.mapper).join(this.separator))
            .map(this.mapperOuter)
            .join(this.separatorOuter)
        )
    }

    stylizeInner(input: string[]): string {
        return this.postprocess(input
            .map(this.mapper)
            .join(this.separator)
        )
    }
}

export class InnerStylizer {
    private readonly separator: string
    private readonly mapper: StringFunction
    private readonly postprocess: StringFunction

    constructor({
        separator = ', ',
        mapper = id as StringFunction,
        postprocess = id as StringFunction,
    } = {}) {
        this.separator = separator
        this.mapper = mapper
        this.postprocess = postprocess
    }

    toStylizer({
        separatorOuter = '; ',
        mapperOuter = id,
    } = {}): Stylizer {
        return new Stylizer({
            separator: this.separator,
            mapper: this.mapper,
            separatorOuter: separatorOuter,
            mapperOuter: mapperOuter,
            postprocess: this.postprocess,
        })
    }

    stylizeInner(input: string[]): string {
        return this.postprocess(input
            .map(this.mapper)
            .join(this.separator)
        )
    }
}
