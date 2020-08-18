import type { Registrar, TagData, Internals } from '../types'

import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { appendStyleTag, getImages, getOffsets } from './utils'

import { setupMenu, enableAsMenuTrigger, menuCss } from './menu'
import { rectKeyword } from './rect'

const clickInsideShape = (draw: SVG, event: MouseEvent) => {
    /* assumes its rect */
    const rect = Rect.wrap(event.target as SVGRectElement)

    if (event.shiftKey) {
        rect.remove()
        return
    }

    const [downX, downY] = getOffsets(event)
    const resizeParameters = getResizeParameters(rect, downX, downY)

    const action = resizeParameters.includes(true)
        ? onMouseMoveResize(rect, ...resizeParameters)
        : onMouseMoveMove(rect, rect.x, rect.y, downX, downY)

    draw.raw.addEventListener('mousemove', action)
    draw.raw.addEventListener('mouseup', (innerEvent: MouseEvent) => {
        innerEvent.preventDefault()
        draw.raw.removeEventListener('mousemove', action)
    }, { once: true })
}

const makeInteractiveShape = (draw: SVG, label: string, downX: number, downY: number, width: number, height: number, options: any) => {
    const newRect = Rect.make()
    newRect.labelText = label
    newRect.x = downX
    newRect.y = downY
    newRect.width = width
    newRect.height = height

    draw.append(newRect)

    const resizer = onMouseMoveResize(newRect, true, true, true, true, downX, downY)

    draw.raw.addEventListener('mousemove', resizer)
    draw.raw.addEventListener('mouseup', () => {
        draw.raw.removeEventListener('mousemove', resizer)

        newRect.rect.addEventListener('mousemove', adaptCursor)

        const shapeMenu = setupMenu('occlusion-shape-menu', [{
            label: 'Change Label',
            itemId: 'change-label',
            clickEvent: () => {
                const newLabel = prompt('Specify the new label', newRect.labelText)
                if (typeof newLabel === 'string') {
                    newRect.labelText = newLabel
                }
            },
        }, {
            label: 'Close Menu',
            itemId: 'close-occlusion-menu',
        }])
        enableAsMenuTrigger(shapeMenu, newRect.rect)

    }, { once: true })
}

const clickOutsideShape = (draw: SVG, event: MouseEvent) => {
    const [downX, downY] = getOffsets(event)
    makeInteractiveShape(draw, 'rect1', downX, downY, 0, 0, {})
}

const occlusionLeftClick = (draw: SVG, event: MouseEvent) => {
    event.preventDefault()

    if ((event.target as Element).nodeName !== 'svg') {
        clickInsideShape(draw, event)
    }

    else {
        clickOutsideShape(draw, event)
    }
}

const rectShapeToCmd = (rect: Rect): [string, number, number, number, number] => {
    return [rect.labelText, rect.x, rect.y, rect.width, rect.height]
}

const rectCmdToText = ([labelText, x, y, width, height]: [string, number, number, number, number]): string => {
    return `[[${labelText}::${x.toFixed()},${y.toFixed()},${width.toFixed()},${height.toFixed()}]]`
}

type OcclusionTextHandler = (occlusions: NodeListOf<SVGElement>, occlusionTexts: string[]) => void

export const wrapForOcclusion = (draw: SVG, occlusionTextHandler: OcclusionTextHandler) => {

    const occlusionClick = (event: MouseEvent) => {
        if (event.button === 0 /* left mouse button */) {
            occlusionLeftClick(draw, event)
        }
    }

    draw.raw.addEventListener('mousedown', occlusionClick)

    const finishEvent = (event: MouseEvent) => {
        event.preventDefault()

        const shapeTexts = Array.from(draw.svg.childNodes)
            .map((v: any /* SVGElement */) => v.childNodes[0] as any)
            .map(svgRect => Rect.wrap(svgRect, draw))
            .map(rectShapeToCmd)
            .map(rectCmdToText)

        occlusionTextHandler(draw.svg.childNodes as NodeListOf<SVGElement>, shapeTexts)

        draw.raw.removeEventListener('mousedown', occlusionClick)
    }

    const occlusionMenu = setupMenu('occlusion-menu', [{
        label: 'Finish',
        itemId: 'occlusion-finish',
        clickEvent: finishEvent,
    }, {
        label: 'Close Menu',
        itemId: 'close-occlusion-menu',
    }])

    enableAsMenuTrigger(occlusionMenu, draw.raw)
}

const defaultOcclusionTextHandler: OcclusionTextHandler = (_occs, texts) => navigator.clipboard.writeText(texts.join('\n'))

export const occlusionMakerRecipe = (options: {
    tagname?: string,
    occlusionTextHandler?: OcclusionTextHandler,
    shapeKeywords?: string[]
} = {})=> (registrar: Registrar<{}>) => {
    const {
        tagname = 'makeOcclusions',
        occlusionTextHandler = defaultOcclusionTextHandler,
        shapeKeywords = [rectKeyword],
    } = options

    const occlusionMakerFilter = (_tag: TagData, { template, cache, aftermath }: Internals<{}>) => {
        const images = (template.textFragments as any).flatMap(getImages)

        aftermath.registerIfNotExists('makeOcclusion', () => {
            appendStyleTag(menuCss)

            const existingShapes: any[] = []
            for (const kw of shapeKeywords) {
                aftermath.block(kw)
                existingShapes.concat(cache.get(kw, []))
            }

            for (const srcUrl of images) {
                const maybeElement = document.querySelector(`img[src="${srcUrl}"]`) as HTMLImageElement

                if (maybeElement) {
                    maybeElement.addEventListener('load', () => {
                        const draw = SVG.wrapImage(maybeElement)
                        wrapForOcclusion(draw, occlusionTextHandler)
                    })
                }
            }
        }, { priority: 100 /* before any other occlusion aftermath */ })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
}
