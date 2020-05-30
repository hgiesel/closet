import { renderTemplate, renderDisjointTemplate } from './render'
import { FilterManager } from './filterManager'

// negative result implies invalid idx
const parseNegativeIndex = (idx: number, max: number): number => {
  return idx < 0
    ? max + idx 
    : idx
}

const getText = (input: Element | Text | ChildNodeSpan | ChildNode | string): string => {
    if (typeof(input) === 'string') {
        return input
    }

    switch (input.nodeType) {
        case Node.TEXT_NODE:
            const textNode = input as Text
            return textNode.textContent

        case Node.ELEMENT_NODE:
            const elementNode = input as Element
            return elementNode.innerHTML

        case ChildNodeSpan.CHILD_NODE_SPAN:
            const span = input as ChildNodeSpan
            return span.spanAsStrings().join('')

        default:
            return ''
    }
}

const setText = (input: Element | Text | ChildNodeSpan | string, newText: string): void => {
    if (typeof(input) === 'string') {
        return
    }

    switch (input.nodeType) {
        case Node.TEXT_NODE:
            const textNode = input as Text
            const placeholderNode = document.createElement('div')

            textNode.parentElement.insertBefore(placeholderNode, textNode)

            textNode.parentElement.removeChild(textNode)
            placeholderNode.outerHTML = newText
            break

        case Node.ELEMENT_NODE:
            const elementNode = input as Element
            elementNode.innerHTML = newText
            break

        case ChildNodeSpan.CHILD_NODE_SPAN:
            const span = input as ChildNodeSpan
            span.replaceSpan(newText)
            break
    }
}

interface ChildNodeIndex {
    type: 'index'
    value: number
    startAtIndex?: number,
    exclusive?: boolean
}

interface ChildNodeNode {
    type: 'node'
    value: Element | Text | ChildNode
    startAtIndex?: number,
    exclusive?: boolean
}

interface ChildNodePredicate {
    type: 'predicate'
    value: (v: Element | Text | ChildNode) => boolean
    startAtIndex?: number,
    exclusive?: boolean
}

type ChildNodePosition = ChildNodeIndex | ChildNodeNode | ChildNodePredicate

export class ChildNodeSpan {
    static readonly CHILD_NODE_SPAN = 3353
    readonly nodeType = ChildNodeSpan.CHILD_NODE_SPAN

    private readonly parent: Element
    private childNodes: ChildNode[]
    private max: number

    private fromIndex: number 
    private toIndex: number 

    constructor(parent: Element, fromValue: ChildNodePosition, toValue: ChildNodePosition) {
        this.parent = parent
        this.childNodes = Array.from(this.parent.childNodes)

        this.max = parent.childNodes.length - 1

        this.fromIndex = fromValue.type === 'index'
            ? this.from(fromValue.value, fromValue.exclusive ?? false)
            : fromValue.type === 'node'
            ? this.fromNode(fromValue.value, fromValue.exclusive ?? false)
            : this.fromPredicate(fromValue.value, fromValue.exclusive ?? false)

        this.toIndex = toValue.type === 'index'
            ? this.to(toValue.value, toValue.exclusive ?? false)
            : toValue.type === 'node'
            ? this.toNode(toValue.value, toValue.exclusive ?? false)
            : this.toPredicate(toValue.value, toValue.exclusive ?? false)
    }

    private fromSafe(i: number): number {
        return i < 0 || i > this.max
            ? this.max
            : i
    }

    private from(i: number, exclusive: boolean): number {
        const parsed = parseNegativeIndex(i, this.max) + (exclusive ? 1 : 0)
        return this.fromSafe(parsed)
    }

    private fromPredicate(pred: (v: Node) => boolean, exclusive: boolean): number {
        const found = this.childNodes.findIndex(pred) + (exclusive ? 1 : 0)
        return this.fromSafe(found)
    }

    private fromNode(node: Node, exclusive: boolean): number {
        const found = this.childNodes.findIndex(
            (v: ChildNode): boolean => v === node,
        ) + (exclusive ? 1 : 0)
        return this.fromSafe(found)
    }

    private toSafe(i: number): number {
        return i < 0 || i > this.max
            ? 0
            : i
    }

    private to(i: number, exclusive: boolean): number {
        const parsed = parseNegativeIndex(i, this.max) - (exclusive ? 1 : 0)
        return this.toSafe(parsed)
    }

    private toPredicate(pred: (v: Node) => boolean, exclusive: boolean): number {
        const found = this.childNodes.findIndex(pred) - (exclusive ? 1 : 0)
        return this.toSafe(found)
    }

    private toNode(node: Node, exclusive: boolean): number {
        const found = this.childNodes.findIndex(
            (v: ChildNode): boolean => v === node,
        ) - (exclusive ? 1 : 0)
        return this.toSafe(found)
    }

    private isValid(): boolean {
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
        return this.span().map(getText)
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

export const renderTemplateFromNode = (input: Element | Text | ChildNodeSpan | string, filterManager: FilterManager): void => {
    const result = renderTemplate(getText(input), filterManager)
    setText(input, result)
}

export const renderTemplateFromNodes = (inputs: Array<Element | Text | ChildNodeSpan | string>, filterManager: FilterManager): void => {
    const results = renderDisjointTemplate(inputs.map(getText), filterManager)
    inputs.forEach((input, index: number) => setText(input, results[index]))
}
