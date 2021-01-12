import type { TagNode, Internals, AftermathEntry, AftermathInternals, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { FlashcardPreset } from '../flashcard'

import { FlashcardTemplate, makeFlashcardTemplate, generateFlashcardRecipes } from '../flashcard/flashcardTemplate'

import type { RectProperty, RectProperties, RectDefinition } from './svgClasses'
import { SVG, Rect } from './svgClasses'

import { appendStyleTag, getImages, imageLoadCallback, svgKeyword, svgCss } from './utils'


export const rectKeyword = 'occlusionRenderRect'

const renderRects = <T extends Record<string, unknown>>(
    entry: AftermathEntry<T>,
    { template, cache, environment }: AftermathInternals<T>,
) => {
    const images = template.textFragments.flatMap(getImages)
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

const makeRects = (
    props: RectProperties,
) => <T extends Record<string, unknown>>(
    { fullKey, values }: TagNode,
    { cache, aftermath }: Internals<T>,
) => {
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
            processProps(rest, props),
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

    front?: (props: RectProperties) => WeakFilter<T>,
    back?: (props: RectProperties) => WeakFilter<T>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,

    frontProperties?: RectProperties,
    backProperties?: RectProperties,
    contextProperties?: RectProperties,
} = {}) => {
    const hide: RectProperties = {
        fill: 'transparent',
        stroke: 'transparent',
    }

    const {
        tagname = 'rect',

        front = makeRects,
        back = makeRects,

        separator = { sep: ',' },
        flashcardTemplate = makeFlashcardTemplate(),

        frontProperties = { fill: 'salmon', stroke: 'yellow' },
        backProperties = hide,
        contextProperties = {},
    } = options

    const rectSeparators = { separators: [separator] }
    const rectRecipe = flashcardTemplate(frontInactive, backInactive)

    return rectRecipe(
        tagname,
        (front as any)(frontProperties),
        back(backProperties),
        makeRects(hide),
        makeRects(contextProperties),
        rectSeparators,
    )
}

export const rectRecipes = generateFlashcardRecipes(rectPublicApi)
