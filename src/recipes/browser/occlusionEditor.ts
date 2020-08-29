import type { Registrar, TagNode, Internals } from '../types'
import { id } from '../utils'

import { SVG, Shape, ShapeDefinition, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { appendStyleTag, getImages, getHighestNum, getOffsets, imageLoadCallback, svgKeyword, svgCss } from './utils'

import { setupMenu, enableAsMenuTrigger, menuCss } from './menu'
import { rectKeyword } from './rect'

const clickInsideShape = (draw: SVG, event: MouseEvent) => {
    /* assumes its rect */
    const rect = Rect.wrap(event.target as SVGRectElement)

    if (event.shiftKey) {
        draw.remove(rect)
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

    const labels = draw.getLabels()
    const currentNum = Math.max(1, getHighestNum(labels) + (event.altKey ? 0 : 1))

    newRect.labelText = `rect${currentNum}`
    newRect.pos = [downX, downY, 0, 0]

    makeInteractive(draw, newRect)

    const resizer = onMouseMoveResize(newRect, true, true, true, true, downX, downY)
    draw.svg.addEventListener('mousemove', resizer)
    draw.svg.addEventListener('mouseup', () => {
        draw.svg.removeEventListener('mousemove', resizer)
        newRect.readjust(draw)
    })
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

type ShapeHandler = (shapes: Shape[], draw: SVG) => void
type ShapeFilter = (shapes: ShapeDefinition[], draw: SVG) => ShapeDefinition[]

export const wrapForOcclusion = (draw: SVG, acceptHandler: ShapeHandler) => {
    const occlusionClick = (event: MouseEvent) => {
        if (event.button === 0 /* left mouse button */) {
            occlusionLeftClick(draw, event)
        }
    }

    draw.svg.addEventListener('mousedown', occlusionClick)

    const acceptEvent = (event: MouseEvent) => {
        event.preventDefault()
        acceptHandler(draw.getElements(), draw)
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


const defaultAcceptHandler: ShapeHandler = (shapes) => navigator.clipboard.writeText(shapes
    .map(shape => shape.toText())
    .join('\n')
)

const occlusionCss = `
.closet__occlusion-container {
  outline: 3px dotted hotpink;
}`

const occlusionMakerCssKeyword = 'occlusionMakerCss'

export const occlusionMakerRecipe = <T extends Record<string, unknown>>(options: {
    tagname?: string,
    acceptHandler?: ShapeHandler,
    existingShapesFilter?: ShapeFilter,
    shapeKeywords?: string[],
} = {})=> (registrar: Registrar<T>) => {
    const keyword = 'makeOcclusions'

    const {
        tagname = keyword,
        acceptHandler = defaultAcceptHandler,
        existingShapesFilter = id,
        shapeKeywords = [rectKeyword],
    } = options

    const occlusionMakerFilter = (_tag: TagNode, internals: Internals<T>) => {
        const images = internals.template.textFragments.flatMap(getImages)

        internals.aftermath.registerIfNotExists(keyword, () => {
            if (!internals.environment.post(occlusionMakerCssKeyword, () => true, false)) {
                appendStyleTag(menuCss)
                appendStyleTag(occlusionCss)
            }

            if (!internals.environment.post(svgKeyword, () => true, false)) {
                appendStyleTag(svgCss)
            }

            const existingShapes: any[] = []
            for (const kw of shapeKeywords) {
                // get shapes for editing
                const otherShapes = internals.cache.get<Shape[]>(kw, [])
                existingShapes.push(...otherShapes)

                // block aftermath render action
                internals.aftermath.block(kw)
            }

            const callback = (event: Event) => {
                const draw = SVG.wrapImage(event.target as HTMLImageElement)

                for (const [
                    shapeType,
                    /* active */,
                    ...rest
                ] of existingShapesFilter(existingShapes, draw)) {

                    let labelTxt = null,
                        x = null,
                        y = null,
                        width = null,
                        height = null,
                        newRect = null

                    switch (shapeType) {
                        case 'rect':
                            [
                                labelTxt,
                                x,
                                y,
                                width,
                                height,
                            ] = rest

                            newRect = Rect.make(draw)
                            newRect.labelText = labelTxt
                            newRect.pos = [x, y, width, height]

                            makeInteractive(draw, newRect)
                            break

                        default:
                            // no other shapes yet
                    }
                }

                wrapForOcclusion(draw, acceptHandler)
            }

            for (const srcUrl of images) {
                imageLoadCallback(`img[src="${srcUrl}"]`, callback)
            }
        }, { priority: 100 /* before any other occlusion aftermath */ })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
}
