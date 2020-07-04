import { SVGRect } from './svgClasses'

export const onMouseMoveResize = (currentShape: SVGRect, left: boolean, right: boolean, top: boolean, bottom: boolean, downX: number, downY: number) => (e: MouseEvent) => {
    const moveX = (e as any).layerX
    const moveY = (e as any).layerY

    if (left && moveX < downX) {
        currentShape.x = moveX
        currentShape.width = downX - moveX
    }
    else if (right) {
        currentShape.x = downX
        currentShape.width = moveX - downX
    }

    if (top && moveY < downY) {
        currentShape.y = moveY
        currentShape.height = downY - moveY
    }
    else if (bottom) {
        currentShape.y = downY
        currentShape.height = moveY - downY
    }
}

export const onMouseMoveMove = (currentShape: SVGRect, startX: number, startY: number, downX: number, downY: number) => (e: MouseEvent): void => {
    const moveX = (e as any).layerX
    const moveY = (e as any).layerY

    const newX = startX + (moveX - downX)
    const newY = startY + (moveY - downY)

    currentShape.x = newX
    currentShape.y = newY
}


const perDirection = <T>(
    leftTop: (shape: SVGRect) => T,
    leftBottom: (shape: SVGRect) => T,
    left: (shape: SVGRect) => T,
    rightTop: (shape: SVGRect) => T,
    rightBottom: (shape: SVGRect) => T,
    right: (shape: SVGRect) => T,
    top: (shape: SVGRect) => T,
    bottom: (shape: SVGRect) => T,
    none: (shape: SVGRect) => T,
) => (rect: SVGRect, downX: number, downY: number): T => {
    const borderOffset = 5

    const offsetLeft = downX - rect.x
    const offsetRight = (rect.x + rect.width) - downX

    const offsetTop = downY - rect.y
    const offsetBottom = (rect.y + rect.height) - downY

    const result = offsetLeft <= borderOffset
        ? offsetTop <= borderOffset
            ? leftTop(rect)
            : offsetBottom <= borderOffset
            ? leftBottom(rect)
            : left(rect)
        : offsetRight <= borderOffset
            ? offsetTop <= borderOffset
                ? rightTop(rect)
                : offsetBottom <= borderOffset
                ? rightBottom(rect)
                : right(rect)
            : offsetTop <= borderOffset
                ? top(rect)
                : offsetBottom <= borderOffset
                ? bottom(rect)
                : none(rect)

    return result
}

export const getResizeParameters = perDirection<[boolean, boolean, boolean, boolean, number, number]>(
    (rect: SVGRect) => [true, false, true, false, rect.x + rect.width, rect.y + rect.height],
    (rect: SVGRect) => [true, false, false, true, rect.x + rect.width, rect.y],
    (rect: SVGRect) => [true, false, false, false, rect.x + rect.width, 0],
    (rect: SVGRect) => [false, true, true, false, rect.x, rect.y + rect.height],
    (rect: SVGRect) => [false, true, false, true, rect.x, rect.y],
    (rect: SVGRect) => [false, true, false, false, rect.x, 0],
    (rect: SVGRect) => [false, false, true, false, 0, rect.y + rect.height],
    (rect: SVGRect) => [false, false, false, true, 0, rect.y],
    () => [false, false, false, false, 0, 0],
)

const getCursor = perDirection<string>(
    () => 'nwse-resize',
    () => 'nesw-resize',
    () => 'ew-resize',
    () => 'nesw-resize',
    () => 'nwse-resize',
    () => 'ew-resize',
    () => 'ns-resize',
    () => 'ns-resize',
    () => 'move',
)

export const adaptCursor = (e: MouseEvent) => {
    const rect = SVGRect.wrap(e.target as Element)
    const rawElement = rect.raw as HTMLDivElement

    if (e.shiftKey) {
        rawElement.style.cursor = 'no-drop'
    }
    else {
        const downX = (e as any).layerX
        const downY = (e as any).layerY

        rawElement.style.cursor = getCursor(rect, downX, downY)
    }
}
