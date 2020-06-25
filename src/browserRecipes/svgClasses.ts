const ns = 'http://www.w3.org/2000/svg'

class SVG {
  svg

  constructor(container) {
    this.svg = document.createElementNS(ns, 'svg')
    this.svg.setAttributeNS(null, 'width', '100%')
    this.svg.setAttributeNS(null, 'height', '100%')
    // svg.setAttribute('viewBox', `0 0 ${event.target.width} ${event.target.height}`)
    // svg.setAttribute('reserveAspectRatio', 'xMidYMid meet')

    container.appendChild(this.svg)
  }

  static make(container) {
    return new SVG(container)
  }

  get raw() { return this.svg }

  append(element) {
    for (const elem of element.getElements()) {
      this.svg.appendChild(elem)
    }
  }
}

class SVGRect {
  element
  label

  constructor(element, label) {
    this.element = element
    this.label = label
  }

  get raw() {
    return this.element
  }

  getElements() {
    return [this.element, this.label]
  }

  attr(attr, i) {
    this.element.setAttributeNS(null, attr, i)
  }

  labelAttr(attr, i) {
    this.label.setAttributeNS(null, attr, i)
  }

  get(attr) {
    const result = this.element.getAttributeNS(null, attr)
    return result
  }

  static make() {
    const element = document.createElementNS(ns, 'rect')
    const label = document.createElementNS(ns, 'text')
    label.innerHTML = '1'

    const theRect = new SVGRect(element, label)

    theRect.x = 0
    theRect.y = 0
    theRect.width = 0
    theRect.height = 0

    return theRect
  }

  static wrap(element) {
    return new SVGRect(element, element.nextSibling)
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
