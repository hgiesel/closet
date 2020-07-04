import { SVG } from './svgClasses'



const dothing = (wrapper) => {
    document.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 'complete') {
            const draw = SVG.make(wrapper)

            draw.raw.addEventListener('mousedown', (e) => {
                e.preventDefault()

                if (e.target.nodeName !== 'svg') {
                    /* assumes its rect */

                    if (e.shiftKey) {
                        e.target.remove()
                        return
                    }

                    const rect = SVGRect.wrap(e.target)
                    const downX = e.layerX
                    const downY = e.layerY

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
                    const downX = e.layerX
                    const downY = e.layerY

                    let anchorX = downX
                    let anchorY = downY

                    const currentRect = SVGRect.make()
                    draw.append(currentRect)

                    currentRect.x = anchorX
                    currentRect.y = anchorY
                    currentRect.fill = 'grey'
                    currentRect.stroke = 'orange'
                    currentRect.strokeWidth = 1
                    currentRect.raw.contentEditable = true

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
    })
}
