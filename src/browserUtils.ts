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

    private _fromIndex: number 
    private _toIndex: number 

    constructor(parent: Element, fromValue: ChildNodePosition, toValue: ChildNodePosition) {
        this.parent = parent
        this.childNodes = Array.from(this.parent.childNodes)

        this.max = parent.childNodes.length - 1

        const fromFunc = this.getFromMethod(fromValue.type)
        const toFunc = this.getToMethod(toValue.type)

        this._fromIndex = fromFunc(
            (fromValue.value as any),
            fromValue.startAtIndex ?? 0,
            fromValue.exclusive ?? false,
        )

        this._toIndex = toFunc(
            (toValue.value as any),
            toValue.startAtIndex ?? 0,
            toValue.exclusive ?? false,
        )
    }

    get fromIndex() {
        return this._fromIndex
    }

    get toIndex() {
        return this.toIndex
    }

    private getFromMethod(name: string) {
        return name === 'index'
            ? this.from
            : name === 'node'
            ? this.fromNode
            : this.fromPredicate
    }

    private getToMethod(name: string) {
        return name === 'index'
            ? this.to
            : name === 'node'
            ? this.toNode
            : this.toPredicate
    }

    private fromSafe(i: number, min: number): number {
        return i < min || i > this.max
            ? this.max
            : i
    }

    private from(i: number, min: number, exclusive: boolean): number {
        const parsed = parseNegativeIndex(i, this.max) + (exclusive ? 1 : 0)
        return this.fromSafe(parsed, min)
    }

    private fromPredicate(pred: (v: Node) => boolean, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(pred) + (exclusive ? 1 : 0)
        return this.fromSafe(found, min)
    }

    private fromNode(node: Node, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(
            (v: ChildNode): boolean => v === node,
        ) + (exclusive ? 1 : 0)
        return this.fromSafe(found, min)
    }

    private toSafe(i: number, min: number): number {
        return i < min || i > this.max
            ? 0
            : i
    }

    private to(i: number, min: number, exclusive: boolean): number {
        const parsed = parseNegativeIndex(i, this.max) - (exclusive ? 1 : 0)
        return this.toSafe(parsed, min)
    }

    private toPredicate(pred: (v: Node) => boolean, min: number, exclusive: boolean): number {
        const found = this.childNodes.findIndex(pred) - (exclusive ? 1 : 0)
        return this.toSafe(found, min)
    }

    private toNode(node: Node, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(
            (v: ChildNode): boolean => v === node,
        ) - (exclusive ? 1 : 0)
        return this.toSafe(found, min)
    }

    private isValid(): boolean {
        return this._fromIndex <= this._toIndex
    }

    length(): number {
        return Math.max(0, this._toIndex - this._fromIndex + 1)
    }

    span(): ChildNode[] {
        return this.isValid()
            ? this.childNodes.slice(this._fromIndex, this._toIndex)
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

        this.parent.insertBefore(placeholderNode, this.parent.childNodes[this._fromIndex])
        for (const node of this.span()) {
            this.parent.removeChild(node)
        }

        // might turn the original div into multiple nodes including text nodes
        placeholderNode.outerHTML = newText

        // reset childNode information
        this.childNodes = Array.from(this.parent.childNodes)
        this.max = this.childNodes.length

        this._toIndex = this._toIndex + (this.max - oldLength)
    }
}

export const interspliceChildren = (parent: Element, skip: ChildNodePosition): ChildNodeSpan[] => {
    const first = new ChildNodeSpan(parent, skip, skip)

    const to = first.toIndex

    while (true) {
        const newSkip = skip
        newSkip.startAtIndex = first.toIndex

        const next = new ChildNodeSpan(parent, newSkip, newSkip)
        to.startAtIndex
    }

    // this needs testing
    return []
}

export const renderTemplateFromNode = (input: Element | Text | ChildNodeSpan | string, filterManager: FilterManager): void => {
    const result = renderTemplate(getText(input), filterManager)
    setText(input, result)
}

export const renderTemplateFromNodes = (inputs: Array<Element | Text | ChildNodeSpan | string>, filterManager: FilterManager): void => {
    const results = renderDisjointTemplate(inputs.map(getText), filterManager)
    inputs.forEach((input, index: number) => setText(input, results[index]))
}
