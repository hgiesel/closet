import type { BrowserTemplate, BrowserTemplateNode } from "../template/browser";

import { keySeparation } from "../patterns";

const imageSrcPattern = /<img[^>]*?src="(.+?)"[^>]*>/g;
const getImages = (txt: string, root: Node): [string, Node][] => {
    const result = [];
    let match: RegExpExecArray | null;

    do {
        match = imageSrcPattern.exec(txt);
        if (match) {
            result.push([match[1], root]);
        }
    } while (match);

    return result as [string, Node][];
};

export const getImagesFromTemplate = (
    template: BrowserTemplate,
): [string, Node][] => {
    const applyGetImages = ([fragment, input]: [string, BrowserTemplateNode]): [
        string,
        Node,
    ][] =>
        typeof input === "string"
            ? []
            : getImages(fragment, input.getRootNode());

    return template.textFragments
        .map((fragment: string, index: number): [
            string,
            BrowserTemplateNode,
        ] => [fragment, template.inputs[index]])
        .flatMap(applyGetImages);
};

export const getOffsets = (event: MouseEvent): [number, number] => {
    if (navigator.userAgent.search("Chrome") >= 0) {
        return [event.offsetX, event.offsetY];
    } /* Firefox support */ else {
        // layerX/Y are deprecated, however offsetX/Y give wrong values on Firefox
        // this does not work when using transform
        const target = event.currentTarget as Element;

        const boundingRect = target.getBoundingClientRect();
        const parentRect = (target.parentElement as Element).getBoundingClientRect();

        const offsetX =
            (event as any).layerX - (parentRect.left - boundingRect.left);
        const offsetY =
            (event as any).layerY - (parentRect.top - boundingRect.top);

        return [offsetX, offsetY];
    }
};

export const imageLoadCallback = (
    query: string,
    root: Node,
    callback: (event: Event) => void,
): void => {
    const maybeElement = (root as any).querySelector(query) as HTMLImageElement;

    if (maybeElement) {
        if (maybeElement.complete) {
            callback({ target: maybeElement } as any);
        } else {
            maybeElement.addEventListener("load", callback);
        }
    }
};

export const getHighestNum = (labels: string[]): number => {
    let result = 0;

    for (const label of labels) {
        const match = label.match(keySeparation);

        if (!match) {
            continue;
        }

        const labelNum = Number(match[2]);

        if (Number.isNaN(labelNum)) {
            continue;
        }

        result = Math.max(result, labelNum);
    }

    return result;
};

export const svgKeyword = "occlusionSvgCss";
export const svgCss = `
img {
  max-width: 100% !important;
}

.closet-occlusion-container {
  display: inline-block;
  position: relative;
}

.closet-occlusion-container > * {
  display: block;

  margin-left: auto;
  margin-right: auto;
}

.closet-occlusion-container > svg {
  position: absolute;
  top: 0;
}

.closet-shape > text {
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}`;
