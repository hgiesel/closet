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
  z-index: 3;
}

.occlusion-container > svg {
  position: absolute;
  z-index: 4;
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

export class SVG {
    svg: SVGElement

    protected constructor(container: Element) {
        this.svg = document.createElementNS(ns, 'svg')
        this.svg.setAttributeNS(null, 'width', '100%')
        this.svg.setAttributeNS(null, 'height', '100%')

        container.appendChild(this.svg)
        container.classList.add('occlusion-container')
    }

    static make(container: Element): SVG {
        return new SVG(container)
    }

    static wrapImage(image: HTMLImageElement): SVG {
        const container = document.createElement('div')

        image.parentNode.replaceChild(container, image)
        container.appendChild(image)

        return SVG.make(container)
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

export class Rect implements GettableSVG {
    readonly container: SVGElement
    readonly rect: SVGRectElement
    readonly label: SVGTextElement

    protected constructor(container, rect, label) {
        this.container = container
        this.rect = rect
        this.label = label
    }

    static make(): Rect {
        const container = document.createElementNS(ns, 'svg')
        const rect = document.createElementNS(ns, 'rect')
        const label = document.createElementNS(ns, 'text')

        container.appendChild(rect)
        container.appendChild(label)
        container.classList.add('occlusion-rect')
        container.tabIndex = -1

        const theRect = new Rect(container, rect, label)

        theRect.x = 0
        theRect.y = 0
        theRect.width = 0
        theRect.height = 0
        theRect.fill = 'moccasin'
        theRect.stroke = 'olive'
        theRect.strokeWidth = 2

        return theRect
    }

    static wrap(rect: SVGRectElement): Rect {
        return new Rect(rect.parentElement, rect, rect.nextSibling)
    }

    remove(): void {
        this.container.remove()
    }

    getElements(): Element[] {
        return [this.container]
    }

    attr(attr, i): void {
        this.rect.setAttributeNS(null, attr, i)
    }

    labelAttr(attr, i): void {
        this.label.setAttributeNS(null, attr, i)
    }

    get(attr) {
        const result = this.rect.getAttributeNS(null, attr)
        return result
    }

    set width(i) {
        const stringified = String(Math.max(10, i))
        this.rect.setAttributeNS(null, 'width', stringified)
        this.label.setAttributeNS(null, 'width', stringified)
    }
    get width() { return Number(this.rect.getAttributeNS(null, 'width')) }

    set height(i) {
        const stringified = String(Math.max(10, i))
        this.rect.setAttributeNS(null, 'height', stringified)
        this.label.setAttributeNS(null, 'height', stringified)
    }
    get height() { return Number(this.rect.getAttributeNS(null, 'height')) }

    set x(i) {
        this.rect.setAttributeNS(null, 'x', String(i))
        this.label.setAttributeNS(null, 'x', String(i + this.width / 2))
    }
    get x() { return Number(this.rect.getAttributeNS(null, 'x')) }

    set y(i) {
        this.rect.setAttributeNS(null, 'y', String(i))
        this.label.setAttributeNS(null, 'y', String(i + this.height / 2))
    }
    get y() { return Number(this.rect.getAttributeNS(null, 'y')) }

    /////////////////// on rect

    set rx(i) { this.attr('rx', i) }
    get rx() { return Number(this.get('rx')) }

    set ry(i) { this.attr('ry', i) }
    get ry() { return Number(this.get('ry')) }

    set fill(color) { this.attr('fill', color) }
    get fill() { return this.get('fill') }

    set stroke(color) { this.attr('stroke', color) }
    get stroke() { return this.get('stroke') }

    set strokeWidth(i) { this.attr('stroke-width', i) }
    get strokeWidth() { return Number(this.get('stroke-width')) }

    set strokeOpacity(i) { this.attr('stroke-opacity', i) }
    get strokeOpacity() { return this.get('stroke-opacity') }

    /////////////////// on label

    set labelText(txt: string) { this.label.innerHTML = txt }
    get labelText(): string { return this.label.innerHTML }
}
