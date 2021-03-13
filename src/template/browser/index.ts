import type { TagRenderer } from "../template";
import type { ASTNode } from "../nodes";
import type { Delimiters } from "../delimiters";
import type { BrowserTemplateNode } from "./childNodes";

import { Template } from "../template";
import { getText, setText } from "./childNodes";

export type { ChildNodeSpan, BrowserTemplateNode } from "./childNodes";

export { interspliceChildNodes } from "./intersplice";

const createStyleTag = (keyword: string, input: string): HTMLStyleElement => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.id = `closet-${keyword}`;
    styleSheet.textContent = input;

    return styleSheet;
};

const hasStyleTag = (root: Document | ShadowRoot, keyword: string): boolean => {
    return Boolean(root.getElementById(`closet-${keyword}`));
};

const appendDocumentStyle = (keyword: string, css: string): void => {
    if (!hasStyleTag(document, keyword)) {
        document.head.appendChild(createStyleTag(keyword, css));
    }
};

const appendStyle = (
    anchor: Exclude<BrowserTemplateNode, string>,
    keyword: string,
    css: string,
): void => {
    const root = anchor.getRootNode() as Document | ShadowRoot;

    if (root instanceof Document) {
        appendDocumentStyle(keyword, css);
    } else if (!hasStyleTag(root, keyword)) {
        root.insertBefore(createStyleTag(keyword, css), root.firstElementChild);
    }
};

export class BrowserTemplate extends Template {
    inputs: BrowserTemplateNode[];

    protected constructor(
        text: string[],
        preparsed: ASTNode[] | null,
        inputs: BrowserTemplateNode[],
        delimiters?: Delimiters,
    ) {
        super(text, preparsed, delimiters);
        this.inputs = inputs;
    }

    static makeFromNode(
        input: BrowserTemplateNode,
        delimiters?: Delimiters,
    ): BrowserTemplate {
        return BrowserTemplate.makeFromNodes([input], delimiters);
    }

    static makeFromNodes(
        inputs: BrowserTemplateNode[],
        delimiters?: Delimiters,
    ): BrowserTemplate {
        return new BrowserTemplate(
            inputs.map((input) => getText(input, false)),
            null,
            inputs,
            delimiters,
        );
    }

    renderToNodes(tagRenderer: TagRenderer): void {
        super.render(tagRenderer, (outputs: string[]) =>
            outputs.forEach((text: string, index: number) =>
                setText(this.inputs[index], text),
            ),
        );
    }

    appendDocumentStyle(keyword: string, css: string): void {
        appendDocumentStyle(keyword, css);
    }

    appendStyle(
        input: Exclude<BrowserTemplateNode, string>,
        keyword: string,
        css: string,
    ): void {
        appendStyle(input, keyword, css);
    }

    appendStyleAll(keyword: string, css: string): void {
        for (const input of this.inputs) {
            if (typeof input !== "string") {
                this.appendStyle(input, keyword, css);
            }
        }
    }
}

const delayKeyword = "closet-delay";

export const cleanup = (): void => {
    for (const element of Array.from(
        document.getElementsByClassName(delayKeyword),
    )) {
        (element as HTMLElement).style.visibility = "visible";
    }
};
