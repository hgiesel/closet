import type { ASTNode } from "./nodes";
import type { TagAccessor } from "./types";
import type { Delimiters } from "./delimiters";

import { nodesAreReady } from "./nodes";
import { Parser } from "./parser";

export interface TemplateInfo {
    template: Template;
    parser: Parser;
}

export interface IterationInfo {
    iteration: number;
}

export interface ResultInfo {
    result: string | string[];
    [k: string]: unknown;
}

// TagRenderer -> TagAcessor -> TagProcessor
export interface TagRenderer {
    makeAccessor: (t: TemplateInfo, i: IterationInfo) => TagAccessor;
    finishIteration: (t: TemplateInfo, i: IterationInfo) => void;
    finishRun: (t: TemplateInfo, x: ResultInfo) => void;
}

const MAX_ITERATIONS = 50;

const stringifyNodes = (nodes: ASTNode[]): string[] => {
    const result: string[] = [];

    if (nodes.length === 0) {
        return result;
    }

    let currentString = "";

    for (const node of nodes) {
        const stringified = node.toString();

        if (typeof stringified === "string") {
            currentString += stringified;
        } else {
            result.push(currentString);
            currentString = "";
        }
    }

    result.push(currentString);

    return result;
};

export class Template {
    readonly textFragments: string[];
    readonly parser: Parser;

    readonly nodes: ASTNode[];

    protected constructor(
        fragments: string[],
        preparsed: ASTNode[] | null,
        delimiters?: Delimiters,
    ) {
        this.textFragments = fragments;
        this.parser = new Parser(delimiters);
        this.nodes = preparsed ?? this.parser.parse(fragments);
    }

    static make(text: string, delimiters?: Delimiters) {
        return new Template([text], null, delimiters);
    }

    static makeFromFragments(texts: string[], delimiters?: Delimiters) {
        return new Template(texts, null, delimiters);
    }

    render(
        tagRenderer: TagRenderer,
        callback: (t: string[]) => void = () => {
            /* do nothing */
        },
    ): string[] {
        const templateInfo: TemplateInfo = {
            template: this,
            parser: this.parser,
        };

        let nodes = this.nodes;
        let ready = false;

        for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
            const iterationInfo: IterationInfo = {
                iteration: i,
            };

            const tagAccessor = tagRenderer.makeAccessor(
                templateInfo,
                iterationInfo,
            );

            nodes = nodes.flatMap((node: ASTNode, index: number) =>
                node.evaluate(this.parser, tagAccessor, [index]),
            );
            ready = nodes.reduce(nodesAreReady, true);

            tagRenderer.finishIteration(templateInfo, iterationInfo);
        }

        const result = stringifyNodes(nodes);

        callback(result);
        tagRenderer.finishRun(templateInfo, { result: result });

        return result;
    }
}
