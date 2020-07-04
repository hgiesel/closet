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

    static wrap(image: HTMLImageElement): SVG {
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
    element: Element
    label: Element

    protected constructor(element, label) {
        this.element = element
        this.label = label
    }

    static make() {
        const element = document.createElementNS(ns, 'rect')
        const label = document.createElementNS(ns, 'text')
        label.innerHTML = '1'

        const theRect = new Rect(element, label)

        theRect.x = 0
        theRect.y = 0
        theRect.width = 0
        theRect.height = 0

        return theRect
    }

    static wrap(element: Element) {
        return new Rect(element, element.nextSibling)
    }

    get raw() {
        return this.element
    }

    getElements(): Element[] {
        return [this.element, this.label]
    }

    attr(attr, i): void {
        this.element.setAttributeNS(null, attr, i)
    }

    labelAttr(attr, i): void {
        this.label.setAttributeNS(null, attr, i)
    }

    get(attr) {
        const result = this.element.getAttributeNS(null, attr)
        return result
    }

    set width(i) {
        this.attr('width', i)
        this.labelAttr('width', i)
    }
    get width() { return Number(this.get('width')) }

    set height(i) {
        this.attr('height', i)
        this.labelAttr('height', i)
    }
    get height() { return Number(this.get('height')) }

    set x(i) {
        this.attr('x', i)
        this.labelAttr('x', i + 10)// + this.label.getBoundingClientRect().width)
    }
    get x() { return Number(this.get('x')) }

    set y(i) {
        this.attr('y', i)
        this.labelAttr('y', i + this.label.getBoundingClientRect().height)
    }
    get y() { return Number(this.get('y')) }

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
}
