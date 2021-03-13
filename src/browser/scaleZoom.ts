/**
 * functions for reversing css properties zoom and transform
 */

export type Reverser = ([x, y]: [number, number]) => [number, number];

const reverseZoom = (style: CSSStyleDeclaration): Reverser => ([origX, origY]: [
    number,
    number,
]): [number, number] => {
    const zoomString = style.getPropertyValue("zoom");
    const zoomValue = Number(zoomString);

    if (Number.isNaN(zoomValue) || zoomValue <= 0) {
        return [origX, origY];
    }

    return [origX / zoomValue, origY / zoomValue];
};

export const reverseEffects = (style: CSSStyleDeclaration): Reverser => ([
    x,
    y,
]: [number, number]) => {
    const zoom = reverseZoom(style);

    return zoom([x, y]);
};
