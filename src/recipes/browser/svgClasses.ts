import { appendStyleTag } from './utils'

const ns = 'http://www.w3.org/2000/svg'
const svgCss = `
.occlusion-container {
  display: inline-block;
  position: relative;
}

.occlusion-container > * {
  display: block;

  max-width: 100%
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

.occlusion-container > img {
  position: relative;
}

.occlusion-container > svg {
  position: absolute;
  top: 0;
}`

appendStyleTag(svgCss)

const occlusionRectCss = `
.occlusion-rect > text {
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}`

appendStyleTag(occlusionRectCss)

interface GettableSVG {
    getElements(): Element[]
}

// const scalingFactorX = event.target.width / event.target.naturalWidth
// const scalingFactorY = event.target.height / event.target.naturalHeight

export class SVG {
    container: HTMLDivElement
    image: HTMLImageElement
    svg: SVGElement

    scalingFactorX: number
    scalingFactorY: number

    protected constructor(container: HTMLDivElement, image: HTMLImageElement, svg: SVGElement) {
        this.container = container
        this.image = image
        this.svg = svg

        this.scalingFactorX = image.width / image.naturalWidth
        this.scalingFactorY = image.height / image.naturalHeight
    }

    static make(container: HTMLDivElement, image: HTMLImageElement): SVG {
        const svg = document.createElementNS(ns, 'svg')
        svg.setAttributeNS(null, 'width', '100%')
        svg.setAttributeNS(null, 'height', '100%')

        container.appendChild(svg)
        container.classList.add('occlusion-container')

        return new SVG(container, image, svg)
    }

    static wrapImage(image: HTMLImageElement): SVG {
        const container = document.createElement('div')

        image.parentNode && image.parentNode.replaceChild(container, image)
        container.appendChild(image)

        return SVG.make(container, image)
    }

    get raw(): SVGElement {
        return this.svg
    }

    append(element: GettableSVG): void {
        for (const elem of element.getElements()) {
            this.svg.appendChild(elem)
        }
    }
}

export type RectProperty = 'rx' | 'ry' | 'fill' | 'fillOpacity' | 'stroke' | 'strokeOpacity' | 'strokeWidth'
export type RectProperties = Partial<Record<RectProperty, string>>

export class Rect implements GettableSVG {
    readonly container: SVGElement
    readonly rect: SVGRectElement
    readonly label: SVGTextElement

    readonly scalingFactorX: number
    readonly scalingFactorY: number

    protected constructor(
        container: SVGElement,
        rect: SVGRectElement,
        label: SVGTextElement,
        scalingFactorX: number,
        scalingFactorY: number,
    ) {
        this.container = container
        this.rect = rect
        this.label = label

        this.scalingFactorX = scalingFactorX
        this.scalingFactorY = scalingFactorY
    }

    static make(forSvg?: SVG): Rect {
        const container = document.createElementNS(ns, 'svg')
        const rect = document.createElementNS(ns, 'rect')
        const label = document.createElementNS(ns, 'text')

        container.appendChild(rect)
        container.appendChild(label)
        container.classList.add('occlusion-rect')
        container.tabIndex = -1

        const scalingFactorX = forSvg ? forSvg.scalingFactorX : 1
        const scalingFactorY = forSvg ? forSvg.scalingFactorY : 1

        const theRect = new Rect(container, rect, label, scalingFactorX, scalingFactorY)

        theRect.x = 0
        theRect.y = 0
        theRect.width = 0
        theRect.height = 0
        theRect.fill = 'moccasin'
        theRect.stroke = 'olive'
        theRect.strokeWidth = 2

        return theRect
    }

    static wrap(rect: SVGRectElement, forSvg?: SVG): Rect {
        const scalingFactorX = forSvg ? forSvg.scalingFactorX : 1
        const scalingFactorY = forSvg ? forSvg.scalingFactorY : 1

        return new Rect(
            rect.parentElement as unknown as SVGElement,
            rect,
            rect.nextSibling as SVGTextElement,
            scalingFactorX,
            scalingFactorY,
        )
    }

    remove(): void {
        this.container.remove()
    }

    getElements(): Element[] {
        return [this.container]
    }

    prop(attr: RectProperty, value: string) {
        this[attr] = value
    }

    /////////////////// on both

    set pos([x, y, width, height]: [number, number, number, number]) {
        this.width = width
        this.height = height

        this.x = x
        this.y = y
    }

    set width(i: number) {
        const stringified = String(Math.max(10, i) * this.scalingFactorX)
        this.rect.setAttributeNS(null, 'width', stringified)
        this.label.setAttributeNS(null, 'width', stringified)
    }
    get width(): number { return Number(this.rect.getAttributeNS(null, 'width')) / this.scalingFactorX }

    set height(i: number) {
        const stringified = String(Math.max(10, i) * this.scalingFactorY)
        this.rect.setAttributeNS(null, 'height', stringified)
        this.label.setAttributeNS(null, 'height', stringified)
    }
    get height(): number { return Number(this.rect.getAttributeNS(null, 'height')) / this.scalingFactorY }

    set x(i: number) {
        const scaledX = i * this.scalingFactorX
        this.rect.setAttributeNS(null, 'x', String(scaledX))
        this.label.setAttributeNS(null, 'x', String((scaledX + this.width / 2 * this.scalingFactorX)))
    }
    get x(): number { return Number(this.rect.getAttributeNS(null, 'x')) / this.scalingFactorX }

    set y(i: number) {
        const scaledY = i * this.scalingFactorY
        this.rect.setAttributeNS(null, 'y', String(scaledY))
        this.label.setAttributeNS(null, 'y', String((scaledY + this.height / 2 * this.scalingFactorY)))
    }
    get y(): number { return Number(this.rect.getAttributeNS(null, 'y')) / this.scalingFactorY }

    /////////////////// on rect

    set rx(i: number | string) { this.rect.setAttributeNS(null, 'rx', String(i)) }
    get rx(): number | string { return Number(this.rect.getAttributeNS(null, 'rx')) }

    set ry(i: number | string) { this.rect.setAttributeNS(null, 'ry', String(i)) }
    get ry(): number | string { return Number(this.rect.getAttributeNS(null, 'ry')) }

    set fill(color: string) { this.rect.setAttributeNS(null, 'fill', color) }
    get fill(): string { return this.rect.getAttributeNS(null, 'fill') ?? ''}

    set fillOpacity(i: number | string) { this.rect.setAttributeNS(null, 'fillOpacity', String(i)) }
    get fillOpacity(): number | string { return Number(this.rect.getAttributeNS(null, 'fillOpacity')) }

    set stroke(color: string) { this.rect.setAttributeNS(null, 'stroke', color) } 
    get stroke(): string { return this.rect.getAttributeNS(null, 'stroke') ?? '' }

    set strokeOpacity(i: number | string) { this.rect.setAttributeNS(null, 'strokeOpacity', String(i)) }
    get strokeOpacity(): number | string { return Number(this.rect.getAttributeNS(null, 'strokeOpacity')) }

    set strokeWidth(i: number | string) { this.rect.setAttributeNS(null, 'strokeWidth', String(i)) }
    get strokeWidth(): number | string { return Number(this.rect.getAttributeNS(null, 'strokeWidth')) }

    /////////////////// on label

    set labelText(txt: string) { this.label.innerHTML = txt }
    get labelText(): string { return this.label.innerHTML }
}

