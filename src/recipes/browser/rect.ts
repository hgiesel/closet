import type { TagNode, Internals, AftermathEntry, AftermathInternals, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { FlashcardPreset } from '../flashcard'

import { FlashcardTemplate, makeFlashcardTemplate, generateFlashcardRecipes } from '../flashcard/flashcardTemplate'

import type { RectProperty, RectProperties, RectDefinition } from './svgClasses'
import { SVG, Rect } from './svgClasses'

import { appendStyleTag, getImages, imageLoadCallback, svgKeyword, svgCss } from './utils'

export const rectKeyword = 'occlusionRenderRect'

const renderRects = <T extends Record<string, unknown>>(entry: AftermathEntry<T>, { template, cache, environment }: AftermathInternals<T>) => {
    const images = (template.textFragments as any).flatMap(getImages)
    const rects = cache.get<RectDefinition[]>(entry.keyword, [])

    if (!environment.post(svgKeyword, () => true, false)) {
        appendStyleTag(svgCss)
    }

    imageLoadCallback(`img[src="${images[0]}"]`, (event) => {
        const draw = SVG.wrapImage(event.target as HTMLImageElement)

        for (const [/* type */, active,, x, y, width, height, options] of rects) {
            if (!active) {
                continue
            }

            const svgRect = Rect.make(draw)
            svgRect.pos = [x, y, width, height]

            for (const prop in options) {
                const rectProperty = prop as RectProperty
                svgRect.prop(rectProperty, options[rectProperty] as string)
            }

            draw.append(svgRect)
        }
    })
}

const processProps = (rest: string[], overwriteProps = {}): RectProperties => {
    const propObject: RectProperties = {}

    rest
        .map((propString: string) => (propString.split('=')) as [RectProperty, string])
        .forEach(([name, value]: [RectProperty, string]) => propObject[name] = value)

    return Object.assign(propObject, overwriteProps)
}

const inactiveRect = <T extends Record<string, unknown>>({ fullKey, values }: TagNode, { cache }: Internals<T>) => {
    const [x = 0, y = 0, width = 50, height = width, ...rest] = values

    cache.over(
        rectKeyword,
        (rectList: RectDefinition[]) => rectList.push([
            'rect',
            false,
            fullKey,
            Number(x),
            Number(y),
            Number(width),
            Number(height),
            processProps(rest),
        ]),
        [],
    )

    return { ready: true }
}

const makeContextRects = <T extends Record<string, unknown>>({ fullKey, values }: TagNode, { cache, aftermath }: Internals<T>) => {
    const [x = 0, y = 0, width = 50, height = width, ...rest] = values

    cache.over(
        rectKeyword,
        (rectList: RectDefinition[]) => rectList.push([
            'rect',
            true,
            fullKey,
            Number(x),
            Number(y),
            Number(width),
            Number(height),
            processProps(rest),
        ]),
        [],
    )

    aftermath.registerIfNotExists(rectKeyword, renderRects as any)

    return { ready: true }
}

const makeActiveRects = <T extends Record<string, unknown>>({ fullKey, values }: TagNode, { cache, aftermath }: Internals<T>) => {
    const [x = 0, y = 0, width = 50, height = width, ...rest] = values
    const activeProps = { fill: 'salmon', stroke: 'yellow' }

    cache.over(
        rectKeyword,
        (rectList: RectDefinition[]) => rectList.push([
            'rect',
            true,
            fullKey,
            Number(x),
            Number(y),
            Number(width),
            Number(height),
            processProps(rest, activeProps)
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
        back = inactiveRect,

        separator = { sep: ',' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const rectSeparators = { separators: [separator] }
    const rectRecipe = flashcardTemplate(frontInactive, backInactive)

    return rectRecipe(tagname, front as any, back, inactiveRect, makeContextRects, rectSeparators)
}

export const rectRecipes = generateFlashcardRecipes(rectPublicApi)
