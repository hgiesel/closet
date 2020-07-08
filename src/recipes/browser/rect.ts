import type { Registrar, TagData, Internals, AftermathEntry, AftermathInternals } from '../types'

import { SVG, Rect } from './svgClasses'
import { getImages } from './utils'

const renderRects = (entry: AftermathEntry<{}>, { template, cache }: AftermathInternals<{}>) => {
    const images = (template.textFragments as any).flatMap(getImages)
    const rects = cache.get(entry.keyword, [])
    const maybeElement = document.querySelector(`img[src="${images[0]}"]`) as HTMLImageElement

    if (maybeElement) {
        const draw = SVG.wrapImage(maybeElement)

        for (const rect of rects) {
            const svgRect = Rect.make()

            ;[svgRect.x, svgRect.y, svgRect.width, svgRect.height] = rect
            draw.append(svgRect)
        }
    }
}

export const rectRecipe = ({
    tagname = 'rect',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    const occlusionMakerFilter = ({ values }: TagData, { cache, aftermath }: Internals<{}>) => {
        const [x = 0, y = 0, width = 50, height = width] = values
        const keyword = 'occlusionRenderRect'

        cache.over(keyword, (rectList: [number, number, number, number][]) => rectList.push([x, y, width, height]), [])
        aftermath.registerIfNotExists(keyword, renderRects)

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter, { separators: [separator] })
}
