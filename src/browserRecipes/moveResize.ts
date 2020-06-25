export const onMouseMoveResize = (currentShape, left, right, top, bottom, downX, downY) => (e) => {
  const moveX = e.layerX
  const moveY = e.layerY

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

export const onMouseMoveMove = (currentShape, startX, startY, downX, downY) => (e) => {
  const moveX = e.layerX
  const moveY = e.layerY

  const newX = startX + (moveX - downX)
  const newY = startY + (moveY - downY)

  currentShape.x = newX
  currentShape.y = newY
}


const perDirection = (leftTop, leftBottom, left, rightTop, rightBottom, right, top, bottom, none) => (rect, downX, downY) => {
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

export const getResizeParameters = perDirection(
  (rect) => [true, false, true, false, rect.x + rect.width, rect.y + rect.height],
  (rect) => [true, false, false, true, rect.x + rect.width, rect.y],
  (rect) => [true, false, false, false, rect.x + rect.width, 0],
  (rect) => [false, true, true, false, rect.x, rect.y + rect.height],
  (rect) => [false, true, false, true, rect.x, rect.y],
  (rect) => [false, true, false, false, rect.x, 0],
  (rect) => [false, false, true, false, 0, rect.y + rect.height],
  (rect) => [false, false, false, true, 0, rect.y],
  () => [false, false, false, false, 0, 0],
)

const getCursor = perDirection(
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

export const adaptCursor = (e) => {
  const rect = SVGRect.wrap(e.target)

  if (e.shiftKey) {
    rect.raw.style.cursor = 'no-drop'
  }
  else {
    const downX = e.layerX
    const downY = e.layerY

    rect.raw.style.cursor = getCursor(rect, downX, downY)
  }
}
