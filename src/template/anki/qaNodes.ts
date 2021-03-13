import type { ChildNodeSpan, BrowserTemplateNode } from "../browser";
import { interspliceChildNodes } from "../browser";

const isElement = (tag: Node): tag is Element =>
    tag.nodeType === Node.ELEMENT_NODE;

const isStyleElement = (tag: Element): tag is HTMLStyleElement =>
    tag.tagName === "STYLE";

const isScriptElement = (tag: Element): tag is HTMLScriptElement =>
    tag.tagName === "SCRIPT";

const isJavaScriptElement = (tag: Element): tag is HTMLScriptElement =>
    isScriptElement(tag) &&
    (tag.type.length === 0 || tag.type.endsWith("javascript"));

// Anki Asset Manager support
const isAnkiAssetManagerElement = (tag: Element): tag is HTMLDivElement =>
    tag.id === "anki-am";

const isTemplateableElement = (tag: Node): boolean =>
    isElement(tag) &&
    (isStyleElement(tag) ||
        isJavaScriptElement(tag) ||
        isAnkiAssetManagerElement(tag));

export const getQaChildNodes = (): ChildNodeSpan[] | null => {
    if (!globalThis.document) {
        return null;
    }

    const qa = globalThis.document.getElementById("qa");

    if (!qa) {
        return null;
    }

    return interspliceChildNodes(qa, {
        type: "predicate",
        value: (tag: BrowserTemplateNode): boolean =>
            !isTemplateableElement(tag as Node),
    });
};
