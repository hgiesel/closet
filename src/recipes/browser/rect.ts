import type { TagData, Internals, AftermathEntry, AftermathInternals, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { FlashcardTemplate, FlashcardPreset } from '../flashcardTemplate'

import { makeFlashcardTemplate, generateFlashcardRecipes } from '../flashcardTemplate'
import { constant } from '../utils'

import { SVG, Rect, RectProperty, RectProperties } from './svgClasses'
import { getImages } from './utils'

const renderRects = (entry: AftermathEntry<{}>, { template, cache }: AftermathInternals<{}>) => {
    const images = (template.textFragments as any).flatMap(getImages)
    const rects = cache.get<[number, number, number, number, RectProperties][]>(entry.keyword, [])
    const maybeElement = document.querySelector(`img[src="${images[0]}"]`) as HTMLImageElement

    if (maybeElement) {
        const draw = SVG.wrapImage(maybeElement)

        for (const [x, y, width, height, options] of rects) {
            const svgRect = Rect.make()

            svgRect.x = x
            svgRect.y = y
            svgRect.width = width
            svgRect.height = height

            for (const prop in options) {
                const rectProperty = prop as RectProperty
                svgRect.prop(rectProperty, options[rectProperty])
            }

            draw.append(svgRect)
        }
    }
}

const doNothing = constant({ ready: true })
const keyword = 'occlusionRenderRect'

const makeContextRects = ({ values }: TagData, { cache, aftermath }: Internals<{}>) => {
    const [x = 0, y = 0, width = 50, height = width] = values

    cache.over(keyword, (rectList: [number, number, number, number, object][]) => rectList.push([x, y, width, height, {}]), [])
    aftermath.registerIfNotExists(keyword, renderRects)

    return { ready: true }
}

const makeActiveRects = ({ values }: TagData, { cache, aftermath }: Internals<{}>) => {
    const [x = 0, y = 0, width = 50, height = width] = values

    cache.over(keyword, (rectList: [number, number, number, number, object][]) => rectList.push([x, y, width, height, { fill: 'salmon', stroke: 'yellow' }]), [])
    aftermath.registerIfNotExists(keyword, renderRects)

    return { ready: true }
}

const rectPublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    front?: WeakFilter<FlashcardPreset>,
    back?: WeakFilter<FlashcardPreset>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'rect',

        front = makeActiveRects,
        back = doNothing,

        separator = { sep: ',' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const rectSeparators = { separators: [separator] }
    const rectRecipe = flashcardTemplate(frontInactive, backInactive)

    return rectRecipe(tagname, front, back, doNothing, makeContextRects, rectSeparators)
}

export const [
    rectShowRecipe,
    rectHideRecipe,
    rectRevealRecipe,
] = generateFlashcardRecipes(rectPublicApi)
