import { baseRender } from './render'
import { FilterManager } from './filterManager'

// negative result implies invalid idx
const parseIndexArgument = (idx: number, min: number, max: number): number => {
  return idx < 0
    ? max + idx + 1
    : min + idx
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
    exclusive?: boolean
    startAtIndex?: number
}

interface ChildNodeNode {
    type: 'node'
    value: Element | Text | ChildNode
    exclusive?: boolean
    startAtIndex?: number
}

interface ChildNodePredicate {
    type: 'predicate'
    value: (v: Element | Text | ChildNode) => boolean
    exclusive?: boolean
    startAtIndex?: number
}

type ChildNodePosition = ChildNodeIndex | ChildNodeNode | ChildNodePredicate

const defaultFromValue: ChildNodeIndex = {
    type: 'index',
    value: 0,
}

const defaultToValue: ChildNodeIndex = {
    type: 'index',
    value: -1,
}

export class ChildNodeSpan {
    static readonly CHILD_NODE_SPAN = 3353 /* this number is arbitrary */
    readonly nodeType = ChildNodeSpan.CHILD_NODE_SPAN

    private readonly parentElement: Element
    private childNodes: ChildNode[]
    private max: number

    private _fromIndex: number 
    private _toIndex: number 

    constructor(
        parentElement: Element,
        fromValue: ChildNodePosition = defaultFromValue,
        toValue: ChildNodePosition = defaultToValue,
    ) {
        this.parentElement = parentElement
        this.childNodes = Array.from(this.parentElement.childNodes)

        this.max = parentElement.childNodes.length - 1

        const fromFunc = this.getFromMethod(fromValue.type)
        const toFunc = this.getToMethod(toValue.type)

        this._fromIndex = fromFunc.call(
            this,
            (fromValue.value as any),
            fromValue.startAtIndex ?? 0,
            fromValue.exclusive ?? false,
        )

        this._toIndex = toFunc.call(
            this,
            (toValue.value as any),
            Math.max(toValue.startAtIndex ?? 0, this.from),
            toValue.exclusive ?? false,
        )
    }

    get from(): number {
        return this._fromIndex
    }

    get to(): number {
        return this._toIndex
    }

    private getFromMethod(name: string) {
        return name === 'index'
            ? this.fromIndex
            : name === 'node'
            ? this.fromNode
            : this.fromPredicate
    }

    private getToMethod(name: string) {
        return name === 'index'
            ? this.toIndex
            : name === 'node'
            ? this.toNode
            : this.toPredicate
    }

    private fromSafe(i: number, min: number): number {
        return i < min || i > this.max
            ? this.max
            : i
    }

    private fromIndex(i: number, min: number, exclusive: boolean): number {
        const parsed = parseIndexArgument(i, min, this.max) + (exclusive ? 1 : 0)
        return this.fromSafe(parsed, min)
    }

    private fromPredicate(pred: (v: Node) => boolean, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(pred) + min + (exclusive ? 1 : 0)
        return this.fromSafe(found, min)
    }

    private fromNode(node: Node, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(
            (v: ChildNode): boolean => v === node,
        ) + min + (exclusive ? 1 : 0)
        return this.fromSafe(found, min)
    }

    private toSafe(i: number, min: number): number {
        return i < min || i > this.max
            ? 0
            : i
    }

    private toIndex(i: number, min: number, exclusive: boolean): number {
        const parsed = parseIndexArgument(i, min, this.max) - (exclusive ? 1 : 0)
        return this.toSafe(parsed, min)
    }

    private toPredicate(pred: (v: Node) => boolean, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(pred) + min - (exclusive ? 1 : 0)
        return this.toSafe(found, min)
    }

    private toNode(node: Node, min: number, exclusive: boolean): number {
        const found = this.childNodes.slice(min).findIndex(
            (v: ChildNode): boolean => v === node,
        ) + min - (exclusive ? 1 : 0)
        return this.toSafe(found, min)
    }

    get valid(): boolean {
        return this._fromIndex <= this._toIndex
    }

    get length(): number {
        return Math.max(0, this._toIndex - this._fromIndex + 1)
    }

    span(): ChildNode[] {
        return this.valid
            ? this.childNodes.slice(this._fromIndex, this._toIndex)
            : []
    }

    spanAsStrings(): string[] {
        return this.span().map(getText)
    }

    replaceSpan(newText: string): void {
        if (!this.valid) {
            return
        }

        const placeholderNode = document.createElement('div')
        const oldLength = this.parentElement.childNodes.length

        this.parentElement.insertBefore(placeholderNode, this.parentElement.childNodes[this._fromIndex])
        for (const node of this.span()) {
            this.parentElement.removeChild(node)
        }

        // might turn the original div into multiple nodes including text nodes
        placeholderNode.outerHTML = newText

        // reset childNode information
        this.childNodes = Array.from(this.parentElement.childNodes)
        this.max = this.childNodes.length

        this._toIndex = this._toIndex + (this.max - oldLength)
    }
}

const makePositions = (template: ChildNodePredicate, currentIndex: number = 0): [ChildNodePredicate, ChildNodePredicate] => {
    const fromSkip: ChildNodePredicate = {
        type: 'predicate',
        value: template.value,
        startAtIndex: currentIndex,
        exclusive: false,
    }
    const toSkip: ChildNodePredicate = {
        type: 'predicate',
        value: (v) => !template.value(v),
        startAtIndex: currentIndex,
        exclusive: true,
    }

    return [fromSkip, toSkip]
}

export const interspliceChildNodes = (parent: Element, skip: ChildNodePredicate): ChildNodeSpan[] => {
    const result = []
    let currentSpan = new ChildNodeSpan(parent, ...makePositions(skip))

    while (currentSpan.valid) {
        result.push(currentSpan)

        currentSpan = new ChildNodeSpan(parent, ...makePositions(skip, currentSpan.to + 1))
    }

    return result
}

export const renderTemplateFromNode = (input: Element | Text | ChildNodeSpan | string, filterManager: FilterManager, cb: (output: string) => void = null): void => {
    const baseDepth = 1
    const result = baseRender([getText(input)], filterManager, baseDepth)

    if (cb) {
        cb(result[0])
    }
    else {
        setText(input, result[0])
    }

    filterManager.executeAftermath()
}

export const renderTemplateFromNodes = (inputs: Array<Element | Text | ChildNodeSpan | string>, filterManager: FilterManager, cb: (output: string[]) => void = null): void => {
    const baseDepth = 2
    const results = baseRender(inputs.map(getText), filterManager, baseDepth)

    if (cb) {
        cb(results)
    }
    else {
        inputs.forEach((input, index: number) => setText(input, results[index]))
    }

    filterManager.executeAftermath()
}

export const appendStyleScript = (input: string): void => {
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = input
    globalThis.document.head.appendChild(styleSheet)
}
