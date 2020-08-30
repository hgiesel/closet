/**
 * functions for reversing css properties zoom and transform
 */

export type Reverser = ([x, y]: [number, number]) => [number, number]

const rawReverseLinearTransformation = (
    a: number,
    b: number,
    c: number,
    d: number,
    translateX: number,
    translateY: number,
): Reverser => ([
    origX,
    origY,
]: [number, number]): [number, number] => {
    return [
        (a * origX + c * origY) + translateX,
        // (origX - c * origY) / a - translateX,
        (b * origX + d * origY) + translateY,
        // (origY - b * origX) / d - translateY,
    ]
}

const matrixPattern = /^matrix\((.*?), (.*?), (.*?), (.*?), (.*?),(.*?)\)$/

const reverseZoom = (
    style: CSSStyleDeclaration,
): Reverser => ([
    origX,
    origY,
]: [number, number]): [number, number] => {
    const zoomString = style.getPropertyValue('zoom')
    const zoomValue = Number(zoomString)

    if (Number.isNaN(zoomValue) || zoomValue <= 0) {
        return [origX, origY]
    }

    return [origX / zoomValue, origY / zoomValue]
}

const reverseLinearTransformation = (
    style: CSSStyleDeclaration,
): Reverser => ([
    origX,
    origY,
]: [number, number]): [number, number] => {
    const transformString = style.getPropertyValue('transform')
    const match = transformString.match(matrixPattern)

    if (!match) {
        return [origX, origY]
    }

    return rawReverseLinearTransformation(
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6]),
    )([origX, origY])
}

export const reverseEffects = (
    style: CSSStyleDeclaration,
): Reverser => ([
    x,
    y,
]: [number, number]) => {
    const zoom = reverseZoom(style)
    // actually not necessary
    // const transform = reverseLinearTransformation(style)

    return zoom([x, y])
}
