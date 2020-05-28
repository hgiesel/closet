import { renderTemplate } from './render'
import { FilterManager } from './filterManager'

// negative result implies invalid idx
const parseNegativeIndex = (idx: number, max: number): number => {
  return idx < 0
    ? max + idx 
    : idx
}

export class ChildNodeSpan {
    static readonly CHILD_NODE_SPAN = 3353
    readonly nodeType = ChildNodeSpan.CHILD_NODE_SPAN

    private readonly parent: Element
    private childNodes: ChildNode[]
    private max: number

    private fromIndex: number 
    private toIndex: number 

    constructor(parent: Element) {
        this.parent = parent
        this.childNodes = Array.from(this.parent.childNodes)

        this.max = parent.childNodes.length - 1

        this.fromIndex = 0
        this.toIndex = this.max
    }

    private fromSafe(i: number): void {
        this.fromIndex = i < 0 || i > this.max
            ? this.max
            : i
    }

    from(i: number): void {
        const parsed = parseNegativeIndex(i, this.max)
        this.fromSafe(parsed)
    }

    fromPredicate(pred: (v: Node) => boolean, exclusive=false): void {
        const found = this.childNodes.findIndex(pred) + (exclusive ? 1 : 0)
        this.fromSafe(found)
    }

    fromNode(node: Node, exclusive=false): void {
        const found = this.childNodes.findIndex(
            (v: ChildNode): boolean => v === node,
        ) + (exclusive ? 1 : 0)
        this.fromSafe(found)
    }

    toSafe(i: number) {
        this.toIndex = i < 0 || i > this.max
            ? 0
            : i
    }

    to(i: number) {
        const parsed = parseNegativeIndex(i, this.max)
        this.toSafe(parsed)
    }

    toPredicate(pred: (v: Node) => boolean, exclusive=false): void {
        const found = this.childNodes.findIndex(pred) - (exclusive ? 1 : 0)
        this.toSafe(found)
    }

    toNode(node: Node, exclusive=false): void {
        const found = this.childNodes.findIndex(
            (v: ChildNode): boolean => v === node,
        ) - (exclusive ? 1 : 0)
        this.toSafe(found)
    }

    isValid(): boolean {
        return this.fromIndex <= this.toIndex
    }

    length(): number {
        return Math.min(0, this.toIndex - this.fromIndex)
    }

    span(): ChildNode[] {
        return this.isValid()
            ? this.childNodes.slice(this.fromIndex, this.toIndex)
            : []
    }

    spanAsStrings(): string[] {
        return this.span().map((v: ChildNode): string => {
            switch (v.nodeType) {
                case Node.TEXT_NODE:
                    return v.textContent
                case Node.ELEMENT_NODE:
                    return (v as Element).outerHTML
                default:
                    return ''
            }
        })
    }

    replaceSpan(newText: string): void {
        if (!this.isValid()) {
            return
        }

        const placeholderNode = document.createElement('div')
        const oldLength = this.parent.childNodes.length

        this.parent.insertBefore(placeholderNode, this.parent.childNodes[this.fromIndex])
        for (const node of this.span()) {
            this.parent.removeChild(node)
        }

        // might turn the original div into multiple nodes including text nodes
        placeholderNode.outerHTML = newText

        // reset childNode information
        this.childNodes = Array.from(this.parent.childNodes)
        this.max = this.childNodes.length

        this.toIndex = this.toIndex + (this.max - oldLength)
    }
}

export const renderTemplateFromNode = (inputNode: Element | Text | ChildNodeSpan, filterManager: FilterManager): void => {
    switch (inputNode.nodeType) {
        case Node.TEXT_NODE:
            const textNode = inputNode as Text
            const placeholderNode = document.createElement('div')

            textNode.parentElement.insertBefore(placeholderNode, textNode)
            const textResult = renderTemplate(textNode.textContent, filterManager)

            textNode.parentElement.removeChild(textNode)
            placeholderNode.outerHTML = textResult

        case Node.ELEMENT_NODE:
            const elementNode = inputNode as Element
            const elementResult = renderTemplate(elementNode.innerHTML, filterManager)

            elementNode.innerHTML = elementResult

        case ChildNodeSpan.CHILD_NODE_SPAN:
            const span = inputNode as ChildNodeSpan
            const spanResult = renderTemplate(span.spanAsStrings().join(''), filterManager)

            span.replaceSpan(spanResult)
    }
}
