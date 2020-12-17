import type { Registrar, TagNode, Internals, AftermathEntry, AftermathInternals } from '../types'
import { id } from '../utils'

import { SVG, Shape, ShapeDefinition, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { reverseEffects } from './scaleZoom'
import { appendStyleTag, getImages, getHighestNum, getOffsets, imageLoadCallback, svgKeyword, svgCss } from './utils'

import { setupMenu, enableAsMenuTrigger, menuCss } from './menu'
import { rectKeyword } from './rect'


const clickInsideShape = (
    draw: SVG,
    event: MouseEvent,
) => {
    /* assumes its rect */
    const rect = Rect.wrap(event.target as SVGRectElement)

    if (event.shiftKey) {
        draw.remove(rect)
        return
    }

    const reverser = reverseEffects(window.getComputedStyle(draw.image))
    const [downX, downY] = reverser(getOffsets(event))

    const resizeParameters = getResizeParameters(rect, downX, downY)

    const action = resizeParameters.includes(true)
        ? onMouseMoveResize(reverser, rect, ...resizeParameters)
        : onMouseMoveMove(reverser, rect, rect.x, rect.y, downX, downY)

    draw.svg.addEventListener('mousemove', action)
    draw.svg.addEventListener('mouseup', (innerEvent: MouseEvent) => {
        innerEvent.preventDefault()
        draw.svg.removeEventListener('mousemove', action)
    }, { once: true })
}

const makeInteractive = (
    draw: SVG,
    newRect: Rect,
): void => {
    const reverser = reverseEffects(window.getComputedStyle(draw.image))
    newRect.rect.addEventListener('mousemove', adaptCursor(reverser, newRect))

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

const initShape = (
    draw: SVG,
    shape: ShapeDefinition,
): void => {
    let labelTxt = null,
        x = null,
        y = null,
        width = null,
        height = null,
        newRect = null

    const [shapeType, /* active */, ...rest] = shape

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

const clickOutsideShape = (draw: SVG, event: MouseEvent) => {
    const reverser = reverseEffects(window.getComputedStyle(draw.image))
    const [downX, downY] = reverser(getOffsets(event))

    const newRect = Rect.make()
    const nextNum = draw.getNextNum(event)

    newRect.labelText = `rect${nextNum}`
    newRect.pos = [downX, downY, 0, 0]

    makeInteractive(draw, newRect)

    const resizer = onMouseMoveResize(reverser, newRect, true, true, true, true, downX, downY)

    draw.svg.addEventListener('mousemove', resizer)
    draw.svg.addEventListener('mouseup', () => {
        draw.svg.removeEventListener('mousemove', resizer)
        newRect.readjust(draw)
    })
}

const occlusionLeftClick = (draw: SVG, event: MouseEvent) => {
    event.preventDefault()

    const click = ((event.target as Element).nodeName !== 'svg')
        ? clickInsideShape
        : clickOutsideShape

    click(draw, event)
}

type PartialShapeHandler = (shapes: Shape[], draw: SVG) => void
type ShapeHandler = <T extends Record<string, unknown>>(entry: AftermathEntry<T>, internals: AftermathInternals<T>) => PartialShapeHandler

type PartialShapeFilter = (shapes: ShapeDefinition[], draw: SVG) => ShapeDefinition[]
type ShapeFilter= <T extends Record<string, unknown>>(entry: AftermathEntry<T>, internals: AftermathInternals<T>) => PartialShapeFilter

export const wrapForOcclusion = (draw: SVG, acceptEvent: () => void) => {
    const occlusionClick = (event: MouseEvent) => {
        if (event.button === 0 /* left mouse button */) {
            occlusionLeftClick(draw, event)
        }
    }

    draw.svg.addEventListener('mousedown', occlusionClick)

    const acceptEventHandler = (event: MouseEvent) => {
        event.preventDefault()
        acceptEvent()
    }

    const occlusionMenu = setupMenu('occlusion-menu', [{
        label: 'Accept occlusions',
        itemId: 'occlusion-accept',
        clickEvent: acceptEventHandler,
    }, {
        label: 'Close Menu',
        itemId: 'close-occlusion-menu',
    }])

    enableAsMenuTrigger(occlusionMenu, draw.svg)
}


const defaultAcceptHandler: ShapeHandler = (_entry, internals) => (shapes) => {
    // window needs active focus for thi
    navigator.clipboard.writeText(shapes
        .map(shape => shape.toText(internals.template.parser.delimiters))
        .join('\n')
    ).catch(() => console.log('Window needs active focus for copying to clipboard'))
}

const defaultRejectHandler: ShapeHandler = () => (_shapes: Shape[], draw: SVG) => draw.cleanup()

const occlusionCss = `
.closet-occlusion-container {
  outline: 3px dotted hotpink;
}`

const occlusionMakerCssKeyword = 'occlusionMakerCss'

export const occlusionMakerRecipe = <T extends Record<string, unknown>>(options: {
    tagname?: string,
    maxOcclusions?: number,
    acceptHandler?: ShapeHandler,
    rejectHandler?: ShapeHandler,
    existingShapesFilter?: ShapeFilter,
    shapeKeywords?: string[],
} = {})=> (registrar: Registrar<T>) => {
    const keyword = 'makeOcclusions'
    const target = new EventTarget()

    const {
        tagname = keyword,
        maxOcclusions = 500,
        acceptHandler = defaultAcceptHandler,
        rejectHandler = defaultRejectHandler,
        existingShapesFilter = () => id,
        shapeKeywords = [rectKeyword],
    } = options

    const occlusionMakerFilter = (_tag: TagNode, internals: Internals<T>) => {
        const images = internals.template.textFragments.flatMap(getImages)

        internals.aftermath.registerIfNotExists(keyword, (entry, internals) => {
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
                draw.setMaxOcclusions(maxOcclusions)

                existingShapesFilter(entry as any, internals)(existingShapes, draw)
                    .forEach((definition: ShapeDefinition) => initShape(draw, definition))

                const acceptEvent = () => {
                    acceptHandler(entry as any, internals)(draw.getElements(), draw)
                }

                const rejectEvent = () => {
                    rejectHandler(entry as any, internals)(draw.getElements(), draw)
                }

                target.addEventListener('accept', acceptEvent)
                target.addEventListener('reject', rejectEvent)

                wrapForOcclusion(draw, () => target.dispatchEvent(new Event('accept')))
            }

            for (const srcUrl of images) {
                imageLoadCallback(`img[src="${srcUrl}"]`, callback)
            }
        }, { priority: 100 /* before any other occlusion aftermath */ })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
    return target
}
