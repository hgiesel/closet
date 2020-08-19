import { appendStyleTag } from './utils'

const ns = 'http://www.w3.org/2000/svg'
const svgCss = `
.closet__occlusion-container {
  display: inline-block;
  position: relative;
}

.closet__occlusion-container > * {
  display: block;

  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.closet__occlusion-container > img {
  position: relative;
}

.closet__occlusion-container > svg {
  position: absolute;
  top: 0;
}

.closet__occlusion-shape > text {
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}`

appendStyleTag(svgCss)

interface GettableSVG {
    getElements(): Element[]
    resize(forSVG: SVG): void
}

export class SVG {
    readonly container: HTMLDivElement
    readonly image: HTMLImageElement
    readonly svg: SVGElement

    protected constrainedFactorX: number = 1
    protected constrainedFactorY: number = 1
    protected zoomX: number = 1
    protected zoomY: number = 1

    protected elements: GettableSVG[] = []

    protected constructor(container: HTMLDivElement, image: HTMLImageElement, svg: SVGElement) {
        this.container = container
        this.image = image
        this.svg = svg

        this.setScaleFactors()
    }

    protected setScaleFactors() {
        this.constrainedFactorX = this.image.width / this.image.naturalWidth
        this.constrainedFactorY = this.image.height / this.image.naturalHeight

        this.zoomX = this.svg.clientWidth / this.image.naturalWidth
        this.zoomY = this.svg.clientHeight / this.image.naturalHeight
    }

    static make(container: HTMLDivElement, image: HTMLImageElement): SVG {
        const svg = document.createElementNS(ns, 'svg')
        svg.setAttributeNS(null, 'width', '100%')
        svg.setAttributeNS(null, 'height', '100%')

        container.appendChild(svg)
        container.classList.add('closet__occlusion-container')

        return new SVG(container, image, svg)
    }

    static wrapImage(image: HTMLImageElement): SVG {
        const container = document.createElement('div')

        image.parentNode && image.parentNode.replaceChild(container, image)
        container.appendChild(image)

        const wrapped = SVG.make(container, image)
        // @ts-ignore
        new ResizeObserver(() => wrapped.resize()).observe(image)

        return wrapped
    }

    get raw(): SVGElement {
        return this.svg
    }

    get scaleFactors(): [number, number] {
        return [
            this.constrainedFactorX * this.zoomX,
            this.constrainedFactorY * this.zoomY,
        ]
    }

    resize(): void {
        this.setScaleFactors()

        for (const elem of this.elements) {
            elem.resize(this)
        }
    }

    append(element: GettableSVG): void {
        this.elements.push(element)

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

    protected scalingFactorX: number
    protected scalingFactorY: number

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

    static make(forSVG?: SVG): Rect {
        const container = document.createElementNS(ns, 'svg')
        const rect = document.createElementNS(ns, 'rect')
        const label = document.createElementNS(ns, 'text')

        container.appendChild(rect)
        container.appendChild(label)
        container.classList.add('closet__occlusion-shape')
        container.classList.add('closet__occlusion_rect')

        container.tabIndex = -1

        const [
            scalingFactorX,
            scalingFactorY,
        ] = forSVG ? forSVG.scaleFactors : [1, 1]

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

    static wrap(rect: SVGRectElement, forSVG?: SVG): Rect {
        const [
            scalingFactorX,
            scalingFactorY,
        ] = forSVG ? forSVG.scaleFactors : [1, 1]

        return new Rect(
            rect.parentElement as unknown as SVGElement,
            rect,
            rect.nextSibling as SVGTextElement,
            scalingFactorX,
            scalingFactorY,
        )
    }

    prop(attr: RectProperty, value: string) {
        this[attr] = value
    }

    remove(): void {
        this.container.remove()
    }

    getElements(): Element[] {
        return [this.container]
    }

    resize(forSVG: SVG) {
        const savePos = this.pos
        const scaleFactors = forSVG.scaleFactors

        this.scalingFactorX = scaleFactors[0]
        this.scalingFactorY = scaleFactors[1]

        this.pos = savePos
    }

    /////////////////// on both

    get pos(): [number, number, number, number] {
        return [
            this.x,
            this.y,
            this.width,
            this.height,
        ]
    }

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

