import {
    id,
} from './utils'

type StringFunction = (v: string) => string

export class Stylizer {
    readonly separator: string
    readonly separatorOuter: string
    readonly mapper: StringFunction
    readonly mapperOuter: StringFunction
    readonly postprocess: StringFunction

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
    readonly separator: string
    readonly mapper: StringFunction
    readonly postprocess: StringFunction

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
