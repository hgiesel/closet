import type { Registrar, TagData, Internals } from '../types'

import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'

const makeOcclusionLeftClick = (draw: SVG, event: MouseEvent) => {
    event.preventDefault()

    const eventTarget = event.target as any

    if (eventTarget.nodeName !== 'svg') {
        /* assumes its rect */
        const rect = Rect.wrap(eventTarget)

        if (event.shiftKey) {
            rect.remove()
            return
        }

        const downX = (event as any).layerX
        const downY = (event as any).layerY

        const resizeParameters = getResizeParameters(rect, downX, downY)

        if (resizeParameters.includes(true)) {
            const resizer = onMouseMoveResize(rect, ...resizeParameters)

            draw.raw.addEventListener('mousemove', resizer)
            draw.raw.addEventListener('mouseup', (innerEvent: MouseEvent) => {
                innerEvent.preventDefault()
                draw.raw.removeEventListener('mousemove', resizer)
            }, { once: true })
        }
        else {
            const mover = onMouseMoveMove(rect, rect.x, rect.y, downX, downY)

            draw.raw.addEventListener('mousemove', mover)
            draw.raw.addEventListener('mouseup', () => {
                draw.raw.removeEventListener('mousemove', mover)
            }, { once: true })
        }
    }

    else {
        const downX = (event as any).layerX
        const downY = (event as any).layerY

        let anchorX = downX
        let anchorY = downY

        const currentRect = Rect.make()
        draw.append(currentRect)

        currentRect.x = anchorX
        currentRect.y = anchorY

        const resizer = onMouseMoveResize(currentRect, true, true, true, true, downX, downY)

        draw.raw.addEventListener('mousemove', resizer)
        draw.raw.addEventListener('mouseup', () => {
            draw.raw.removeEventListener('mousemove', resizer)

            currentRect.rect.addEventListener('mousemove', adaptCursor)
            currentRect.rect.addEventListener('dblclick', () => { console.log('dblclick') })
        }, { once: true })
    }
}

const rectShapeToCmd = (rect: Rect) => {
    return [rect.x, rect.y, rect.width, rect.height]
}

const rectCmdToText = ([x, y, width, height]: [number, number, number, number]) => {
    return `[[rect1::${x},${y},${width},${height}]]`
}

export const wrapImage = (draw: SVG) => {
    const occlusionUi = (event: MouseEvent) => {
        if (event.button === 0 /* left mouse button */) {
            makeOcclusionLeftClick(draw, event)
        }
    }

    const occlusionContextMenu = (event: MouseEvent) => {
        event.preventDefault()

        const shapeText = Array.from(draw.svg.childNodes)
            .map((v: SVGElement) => v.childNodes[0])
            .map(Rect.wrap)
            .map(rectShapeToCmd)
            .map(rectCmdToText)
            .join('\n')

        navigator.clipboard.writeText(shapeText)

        draw.raw.removeEventListener('mousedown', occlusionUi)
        draw.raw.removeEventListener('contextmenu', occlusionContextMenu)
    }

    draw.raw.addEventListener('mousedown', occlusionUi)
    draw.raw.addEventListener('contextmenu', occlusionContextMenu)
}

const imageSrcPattern = /<img[^>]*?src="(.+?)"[^>]*>/g
const getImages = (txt: string) => {
    const result = []
    let match: RegExpExecArray | null

    do {
        match = imageSrcPattern.exec(txt)
        if (match) {
            result.push(match[1])
        }
    } while (match)

    return result
}

export const occlusionMakerRecipe = ({
    tagname = 'makeOcclusions',
} = {}) => (registrar: Registrar<{}>) => {

    const occlusionMakerFilter = (_tag: TagData, { template, aftermath }: Internals<{}>) => {
        const images = (template.textFragments as any).flatMap(getImages)

        aftermath.registerIfNotExists('makeOcclusion', () => {
            aftermath.block('occlusionRenderRect')

            for (const srcUrl of images) {
                const maybeElement = document.querySelector(`img[src="${srcUrl}"]`) as HTMLImageElement

                if (maybeElement) {
                    const draw = SVG.wrapImage(maybeElement)
                    wrapImage(draw)
                }
            }
        }, { priority: 100 /* before any other occlusion aftermath */ })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
}

export const rectRecipe = ({
    tagname = 'rect',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    const occlusionMakerFilter = ({ values }: TagData, { cache, aftermath }: Internals<{}>) => {
        const [x = 0, y = 0, width = 50, height = width] = values

        cache.over('occlusionRenderRect', (rectList: [number, number, number, number][]) => rectList.push([x, y, width, height]), [])

        aftermath.registerIfNotExists('occlusionRenderRect', (_entry, { template }) => {
            const images = (template.textFragments as any).flatMap(getImages)
            const rects = cache.get('occlusionRenderRect', [])
            const maybeElement = document.querySelector(`img[src="${images[0]}"]`) as HTMLImageElement

            if (maybeElement) {
                const draw = SVG.wrapImage(maybeElement)

                for (const rect of rects) {
                    const svgRect = Rect.make()

                    ;[svgRect.x, svgRect.y, svgRect.width, svgRect.height] = rect
                    draw.append(svgRect)
                }
            }
        })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter, { separators: [separator] })
}
