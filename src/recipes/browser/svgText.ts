class SVGText {
  element

  constructor(element) {
    this.element = element
  }

  static make() {
    const element = document.createElementNS(ns, 'text')
    const theText = new SVGText(element)

    theText.x = 0
    theText.y = 0
    theText.width = 100
    theText.height = 50
    theText.text = 'Text'

    return theText
  }

  static wrap(element) {
    return new SVGText(element)
  }

  get raw() {
    return this.element
  }

  attr(attr, i) {
    this.element.setAttributeNS(null, attr, i)
  }

  get(attr) {
    const result = this.element.getAttributeNS(null, attr)
    return result
  }

  set text(txt) { this.raw.innerHTML = txt }
  get text() { return this.raw.innerHTML }

  set width(i) { this.attr('width', i) }
  get width() { return Number(this.get('width')) }

  set height(i) { this.attr('height', i) }
  get height() { return Number(this.get('height')) }

  set x(i) { this.attr('x', i) }
  get x() { return Number(this.get('x')) }

  set y(i) { this.attr('y', i) }
  get y() { return Number(this.get('y')) }

  set fill(color) { this.attr('fill', color) }
  get fill() { return this.get('fill') }

  set stroke(color) { this.attr('stroke', color) }
  get stroke() { return this.get('stroke') }

  set strokeWidth(i) { this.attr('stroke-width', i) }
  get strokeWidth() { return Number(this.get('stroke-width')) }

  set strokeOpacity(i) { this.attr('stroke-opacity', i) }
  get strokeOpacity() { return this.get('stroke-opacity') }
}
