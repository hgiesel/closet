import type { ChildNodePredicate, BrowserTemplateNode } from "./childNodes";

import { ChildNodeSpan } from "./childNodes";

const makePositions = (
    template: ChildNodePredicate,
    currentIndex = 0,
): [ChildNodePredicate, ChildNodePredicate] => {
    const fromSkip: ChildNodePredicate = {
        type: "predicate",
        value: template.value,
        startAtIndex: currentIndex,
        exclusive: false,
    };
    const toSkip: ChildNodePredicate = {
        type: "predicate",
        value: (v: BrowserTemplateNode): boolean => !template.value(v),
        startAtIndex: currentIndex,
        exclusive: true,
    };

    return [fromSkip, toSkip];
};

export const interspliceChildNodes = (
    parent: Element,
    skip: ChildNodePredicate,
): ChildNodeSpan[] => {
    const result: ChildNodeSpan[] = [];
    let currentSpan = new ChildNodeSpan(parent, ...makePositions(skip));

    while (currentSpan.valid) {
        result.push(currentSpan);

        currentSpan = new ChildNodeSpan(
            parent,
            ...makePositions(skip, currentSpan.to + 1),
        );
    }

    return result;
};
