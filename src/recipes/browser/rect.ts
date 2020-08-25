import type { TagNode, Internals, AftermathEntry, AftermathInternals, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { FlashcardTemplate, FlashcardPreset } from '../flashcardTemplate'

import { makeFlashcardTemplate, generateFlashcardRecipes } from '../flashcardTemplate'

import { SVG, Rect, RectProperty, RectProperties } from './svgClasses'
import { appendStyleTag, getImages, imageLoadCallback, svgKeyword, svgCss } from './utils'

export const rectKeyword = 'occlusionRenderRect'

type RectDefinition = ['rect', boolean, string, number, number, number, number, RectProperties]

const renderRects = <T extends {}>(entry: AftermathEntry<T>, { template, cache, environment }: AftermathInternals<T>) => {
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
            svgRect.x = x
            svgRect.y = y
            svgRect.width = width
            svgRect.height = height
            console.log('options', options)

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

const inactiveRect = <T extends {}>({ fullKey, values }: TagNode, { cache }: Internals<T>) => {
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

const makeContextRects = <T extends {}>({ fullKey, values }: TagNode, { cache, aftermath }: Internals<T>) => {
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

const makeActiveRects = <T extends {}>({ fullKey, values }: TagNode, { cache, aftermath }: Internals<T>) => {
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

export const [
    rectShowRecipe,
    rectHideRecipe,
    rectRevealRecipe,
] = generateFlashcardRecipes(rectPublicApi)
