import type { ChildNodeSpan } from '../browser'
import { interspliceChildNodes } from '../browser'

const isElement = (tag: ChildNode): tag is Element => (
    tag.nodeType === Node.ELEMENT_NODE
)

const isStyleElement = (tag: Element): tag is HTMLStyleElement => (
    tag.tagName === 'STYLE'
)

const isScriptElement = (tag: Element): tag is HTMLScriptElement => (
    tag.tagName === 'SCRIPT'
)

const isJavaScriptElement = (tag: Element): tag is HTMLScriptElement => (
    isScriptElement(tag) &&
    (tag.type.length === 0 || tag.type.endsWith('javascript'))
)

// Anki Asset Manager support
const isAnkiAssetManagerElement = (tag: Element): tag is HTMLDivElement => (
    tag.id === 'anki-am' 
)

export const getQaChildNodes = (): ChildNodeSpan[] | null => {
    if (!window.document) {
        return null
    }

    const qa = window.document.getElementById('qa')

    if (!qa) {
        return null
    }

    return interspliceChildNodes(qa, {
        type: 'predicate',
        value: (tag: ChildNode): boolean => !(
            isElement(tag) && (
                isStyleElement(tag) ||
                isJavaScriptElement(tag) ||
                isAnkiAssetManagerElement(tag)
            )
        )
    })
}
