import { Rect } from './svgClasses'

export const onMouseMoveResize = (currentShape: Rect, left: boolean, right: boolean, top: boolean, bottom: boolean, downX: number, downY: number) => (e: MouseEvent) => {
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

export const onMouseMoveMove = (currentShape: Rect, startX: number, startY: number, downX: number, downY: number) => (e: MouseEvent): void => {
    const moveX = (e as any).layerX
    const moveY = (e as any).layerY

    const newX = startX + (moveX - downX)
    const newY = startY + (moveY - downY)

    currentShape.x = newX
    currentShape.y = newY
}

const perDirection = <T>(
    leftTop: (shape: Rect) => T,
    leftBottom: (shape: Rect) => T,
    left: (shape: Rect) => T,
    rightTop: (shape: Rect) => T,
    rightBottom: (shape: Rect) => T,
    right: (shape: Rect) => T,
    top: (shape: Rect) => T,
    bottom: (shape: Rect) => T,
    none: (shape: Rect) => T,
) => (rect: Rect, downX: number, downY: number): T => {
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
    (rect: Rect) => [true, false, true, false, rect.x + rect.width, rect.y + rect.height],
    (rect: Rect) => [true, false, false, true, rect.x + rect.width, rect.y],
    (rect: Rect) => [true, false, false, false, rect.x + rect.width, 0],
    (rect: Rect) => [false, true, true, false, rect.x, rect.y + rect.height],
    (rect: Rect) => [false, true, false, true, rect.x, rect.y],
    (rect: Rect) => [false, true, false, false, rect.x, 0],
    (rect: Rect) => [false, false, true, false, 0, rect.y + rect.height],
    (rect: Rect) => [false, false, false, true, 0, rect.y],
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
    const rect = Rect.wrap(e.target as SVGRectElement)
    const rawElement = rect.rect

    if (e.shiftKey) {
        rawElement.style.cursor = 'no-drop'
    }
    else {
        const downX = (e as any).layerX
        const downY = (e as any).layerY

        rawElement.style.cursor = getCursor(rect, downX, downY)
    }
}

export const adaptCursorKeydown = (e: KeyboardEvent) => {
    const rect = Rect.wrap(e.target as SVGRectElement)
    const rawElement = rect.rect

    if (e.shiftKey) {
        rawElement.style.cursor = 'no-drop'
    }
}
