import type { Registrar, TagData, Internals } from '../types'

import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { appendStyleTag, getImages, getOffsets } from './utils'

import { setupMenu, enableAsMenuTrigger, menuCss } from './menu'

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

const clickOutsideShape = (draw: SVG, event: MouseEvent) => {
    const currentRect = Rect.make()
    currentRect.labelText = 'rect1'

    const [downX, downY] = getOffsets(event)
    currentRect.x = downX
    currentRect.y = downY

    draw.append(currentRect)

    const resizer = onMouseMoveResize(currentRect, true, true, true, true, downX, downY)

    draw.raw.addEventListener('mousemove', resizer)
    draw.raw.addEventListener('mouseup', () => {
        draw.raw.removeEventListener('mousemove', resizer)

        currentRect.rect.addEventListener('mousemove', adaptCursor)

        const shapeMenu = setupMenu('occlusion-shape-menu', [{
            label: 'Change Label',
            itemId: 'change-label',
            clickEvent: () => {
                const newLabel = prompt('Specify the new label', currentRect.labelText)
                if (typeof newLabel === 'string') {
                    currentRect.labelText = newLabel
                }
            },
        }, {
            label: 'Close Menu',
            itemId: 'close-occlusion-menu',
        }])
        enableAsMenuTrigger(shapeMenu, currentRect.rect)

    }, { once: true })
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
} = {})=> (registrar: Registrar<{}>) => {
    const {
        tagname = 'makeOcclusions',
        occlusionTextHandler = defaultOcclusionTextHandler,
    } = options

    const occlusionMakerFilter = (_tag: TagData, { template, aftermath }: Internals<{}>) => {
        const images = (template.textFragments as any).flatMap(getImages)

        aftermath.registerIfNotExists('makeOcclusion', () => {
            aftermath.block('occlusionRenderRect')
            appendStyleTag(menuCss)

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
