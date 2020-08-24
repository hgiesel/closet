import type { Registrar, TagNode, Internals } from '../types'

import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { appendStyleTag, getImages, getOffsets, imageLoadCallback, svgKeyword, svgCss } from './utils'

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

    draw.svg.addEventListener('mousemove', action)
    draw.svg.addEventListener('mouseup', (innerEvent: MouseEvent) => {
        innerEvent.preventDefault()
        draw.svg.removeEventListener('mousemove', action)
    }, { once: true })
}

const makeInteractive = (
    draw: SVG,
    newRect: Rect,
) => {
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

    draw.append(newRect)
}

const clickOutsideShape = (draw: SVG, event: MouseEvent) => {
    const [downX, downY] = getOffsets(event)

    const newRect = Rect.make()
    newRect.labelText = 'rect1'
    newRect.pos = [downX, downY, 0, 0]

    makeInteractive(draw, newRect)

    const resizer = onMouseMoveResize(newRect, true, true, true, true, downX, downY)
    draw.svg.addEventListener('mousemove', resizer)
    draw.svg.addEventListener('mouseup', () => draw.svg.removeEventListener('mousemove', resizer))
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

    draw.svg.addEventListener('mousedown', occlusionClick)

    const acceptEvent = (event: MouseEvent) => {
        event.preventDefault()

        const shapeTexts = Array.from(draw.svg.childNodes)
            .map((v: any /* SVGElement */) => v.childNodes[0] as any)
            .map(svgRect => Rect.wrap(svgRect, draw))
            .map(rectShapeToCmd)
            .map(rectCmdToText)

        occlusionTextHandler(draw.svg.childNodes as NodeListOf<SVGElement>, shapeTexts)
    }

    const occlusionMenu = setupMenu('occlusion-menu', [{
        label: 'Accept occlusions',
        itemId: 'occlusion-accept',
        clickEvent: acceptEvent,
    }, {
        label: 'Close Menu',
        itemId: 'close-occlusion-menu',
    }])

    enableAsMenuTrigger(occlusionMenu, draw.svg)
}

const defaultOcclusionTextHandler: OcclusionTextHandler = (_occs, texts) => navigator.clipboard.writeText(texts.join('\n'))

const occlusionCss = `
.closet__occlusion-container {
  outline: 3px dotted hotpink;
}`

const occlusionMakerCssKeyword = 'occlusionMakerCss'

export const occlusionMakerRecipe = <T extends {}>(options: {
    tagname?: string,
    occlusionTextHandler?: OcclusionTextHandler,
    shapeKeywords?: string[]
} = {})=> (registrar: Registrar<T>) => {
    const keyword = 'makeOcclusions'

    const {
        tagname = keyword,
        occlusionTextHandler = defaultOcclusionTextHandler,
        shapeKeywords = [rectKeyword],
    } = options

    const occlusionMakerFilter = (_tag: TagNode, { template, cache, aftermath, environment }: Internals<T>) => {
        const images = (template.textFragments as any).flatMap(getImages)

        aftermath.registerIfNotExists(keyword, () => {
            if (!environment.post(occlusionMakerCssKeyword, () => true, false)) {
                appendStyleTag(menuCss)
                appendStyleTag(occlusionCss)
            }

            if (!environment.post(svgKeyword, () => true, false)) {
                appendStyleTag(svgCss)
            }

            const existingShapes: any[] = []
            for (const kw of shapeKeywords) {
                // get shapes for editing
                const otherShapes = cache.get(kw, [])
                existingShapes.push(...otherShapes)

                // block aftermath render action
                aftermath.block(kw)
            }

            const callback = (event: Event) => {
                const draw = SVG.wrapImage(event.target as HTMLImageElement)

                for (const [_active, labelTxt, x, y, width, height] of existingShapes) {
                    const newRect = Rect.make(draw)
                    newRect.labelText = labelTxt
                    newRect.pos = [x, y, width, height]

                    makeInteractive(draw, newRect)
                }

                wrapForOcclusion(draw, occlusionTextHandler)
            }

            for (const srcUrl of images) {
                imageLoadCallback(`img[src="${srcUrl}"]`, callback)
            }
        }, { priority: 100 /* before any other occlusion aftermath */ })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
}
