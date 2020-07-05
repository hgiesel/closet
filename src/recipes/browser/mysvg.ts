import type { Registrar, TagData, Internals } from '../types'

import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'

export const wrapImage = (wrapped) => {
    const draw = SVG.wrapImage(wrapped)

    draw.raw.addEventListener('mousedown', (e) => {
        e.preventDefault()

        const eventTarget = e.target as any

        if (eventTarget.nodeName !== 'svg') {
            /* assumes its rect */

            if (e.shiftKey) {

                eventTarget.remove()
                return
            }

            const rect = Rect.wrap(e.target as any)
            const downX = (e as any).layerX
            const downY = (e as any).layerY

            const resizeParameters = getResizeParameters(rect, downX, downY)

            if (resizeParameters.includes(true)) {
                const resizer = onMouseMoveResize(rect, ...resizeParameters)

                draw.raw.addEventListener('mousemove', resizer)
                draw.raw.addEventListener('mouseup', (e) => {
                    e.preventDefault()
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
            const downX = (e as any).layerX
            const downY = (e as any).layerY

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
    })
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
        console.log(template.textFragments)
        const images = (template.textFragments as any).flatMap(getImages)

        aftermath.registerIfNotExists('makeOcclusion', () => {
            for (const srcUrl of images) {
                const maybeElement = document.querySelector(`img[src="${srcUrl}"]`)

                if (maybeElement) {
                    wrapImage(maybeElement)
                }
            }
        })

        return { ready: true }
    }

    registrar.register(tagname, occlusionMakerFilter)
}
