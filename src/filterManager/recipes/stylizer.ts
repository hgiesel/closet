import {
    id,
} from './utils'

class Stylizer {
    private readonly separator: string
    private readonly separatorOuter: string
    private readonly mapper: (v: string) => string
    private readonly mapperOuter: (v: string) => string
    private readonly postprocess: (v: string) => string

    constructor({
        separator = ', ',
        separatorOuter = '; ',
        mapper = id,
        mapperOuter = id,
        postprocess = id,
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
        return this.mapperOuter(input
            .map(this.mapper)
            .join(this.separator)
        )
    }
}

export default Stylizer
