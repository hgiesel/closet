// negative result implies invalid idx
const parseIndex = (idx: number, max: number): number => {
  return idx < 0
    ? max + idx 
    : idx >= max
    ? max - 1
    : idx
}

class ChildNodeSpan {
    static CHILD_NODE_SPAN = 3353
    readonly nodeType = 3353

    private readonly parent: Element
    private min: number
    private max: number

    private fromIndex: number 
    private toIndex: number 

    constructor(parent: Element) {
        this.parent = parent
        this.min = 0
        this.max = parent.childNodes.length - 1

        this.fromIndex = this.min
        this.toIndex = this.max
    }

    from(i: number): void {
        this.fromIndex = Math.max(0, parseIndex(i, this.max))
    }

    to(i: number) {
        const result = parseIndex(i, this.max)
        this.toIndex = result < 0
            ? this.max
            : result
    }

    getSpan(): ChildNode[] {
        const allChildren = Array.from(this.parent.childNodes)

        return allChildren.slice(this.fromIndex, this.toIndex)
    }

    getSpanAsStrings(): string[] {
        const childNodes = this.getSpan()

        return childNodes.map((v: ChildNode): string => {
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

    // TODO
    // replaceSpan(newText: string): void {
    //     const replacementNode = document.createElement('div')
    //     const childNodes = this.getSpan()

    //     // might turn the original div into multiple nodes including text nodes
    //     replacementNode.outerHTML = newText

    //     n.parentNode.insertBefore(replacementNode, n);
    //     n.parentNode.removeChild(n);
    // }
}
