import type { TagData, Internals, AftermathEntry, AftermathInternals, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { FlashcardTemplate, FlashcardPreset } from '../flashcardTemplate'

import { makeFlashcardTemplate, generateFlashcardRecipes } from '../flashcardTemplate'
import { constant } from '../utils'

import { SVG, Rect, RectProperty, RectProperties } from './svgClasses'
import { getImages } from './utils'

export const rectKeyword = 'occlusionRenderRect'

const renderRects = <T extends {}>(entry: AftermathEntry<T>, { template, cache }: AftermathInternals<T>) => {
    const images = (template.textFragments as any).flatMap(getImages)
    const rects = cache.get<[number, number, number, number, RectProperties][]>(entry.keyword, [])
    const maybeElement = document.querySelector(`img[src="${images[0]}"]`) as HTMLImageElement

    if (maybeElement) {
        const draw = SVG.wrapImage(maybeElement)

        for (const [x, y, width, height, options] of rects) {
            const svgRect = Rect.make(draw)

            svgRect.x = x
            svgRect.y = y
            svgRect.width = width
            svgRect.height = height

            for (const prop in options) {
                const rectProperty = prop as RectProperty
                svgRect.prop(rectProperty, options[rectProperty] as string)
            }

            draw.append(svgRect)
        }
    }
}

const doNothing = constant({ ready: true })

const makeContextRects = <T extends {}>({ fullKey, values }: TagData, { cache, aftermath }: Internals<T>) => {
    const [x = 0, y = 0, width = 50, height = width] = values

    cache.over(
        rectKeyword,
        (rectList: [string, number, number, number, number, object][]) => rectList.push([
            fullKey,
            x,
            y,
            width,
            height,
            {}
        ]),
        [],
    )

    aftermath.registerIfNotExists(rectKeyword, renderRects as any)

    return { ready: true }
}

const makeActiveRects = <T extends {}>({ fullKey, values }: TagData, { cache, aftermath }: Internals<T>) => {
    const [x = 0, y = 0, width = 50, height = width] = values

    cache.over(
        rectKeyword,
        (rectList: [string, number, number, number, number, object][]) => rectList.push([
            fullKey,
            x,
            y,
            width,
            height,
            { fill: 'salmon', stroke: 'yellow' }
        ]),
        [],
    )

    aftermath.registerIfNotExists(rectKeyword, renderRects as any)

    return { ready: true }
}

const rectPublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    front?: WeakFilter<T>,
    back?: WeakFilter<T>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
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

    return rectRecipe(tagname, front as any, back, doNothing, makeContextRects, rectSeparators)
}

export const [
    rectShowRecipe,
    rectHideRecipe,
    rectRevealRecipe,
] = generateFlashcardRecipes(rectPublicApi)
