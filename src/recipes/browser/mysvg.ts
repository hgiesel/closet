import type { Registrar, TagData, Internals } from '../types'


import { SVG, Rect } from './svgClasses'
import { adaptCursor, getResizeParameters, onMouseMoveResize, onMouseMoveMove } from './moveResize'
import { wrapWithAftermath } from '../wrappers'

export const wrapImage = (wrapped) => {
    const draw = SVG.wrap(wrapped)

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
            currentRect.fill = 'grey'
            currentRect.stroke = 'orange'
            currentRect.strokeWidth = 1

            const resizer = onMouseMoveResize(currentRect, true, true, true, true, downX, downY)

            draw.raw.addEventListener('mousemove', resizer)
            draw.raw.addEventListener('mouseup', () => {
                draw.raw.removeEventListener('mousemove', resizer)

                currentRect.raw.addEventListener('mousemove', adaptCursor)
                currentRect.raw.addEventListener('dblclick', () => { console.log('dblclick') })
            }, { once: true })
        }
    })
}

export const occlusionMakerRecipe = ({
    tagname = 'makeOcclusions',
}) => (registrar: Registrar<{}>) => {

    const occlusionMakerFilter = (tag: TagData, { aftermath }: Internals<{}>) => {
        aftermath.registerIfNotExists('makeOcclusion', (entry, internals) => {
            console.log(entry)
        })
    }

    registrar.register(tagname, occlusionMakerFilter)
}
