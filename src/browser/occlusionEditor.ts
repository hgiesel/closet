import type {
    Registrar,
    TagNode,
    Internals,
    AftermathEntry,
    AftermathInternals,
} from "../types";
import type { MenuItem } from "./menuConstruction";
import type { BrowserTemplate } from "../template/browser";
import { id } from "../utils";

import { SVG, Shape, ShapeDefinition, Rect } from "./svgClasses";
import {
    adaptCursor,
    getResizeParameters,
    onMouseMoveResize,
    onMouseMoveMove,
} from "./moveResize";
import { reverseEffects } from "./scaleZoom";
import {
    getImagesFromTemplate,
    getOffsets,
    imageLoadCallback,
    svgKeyword,
    svgCss,
} from "./utils";

import { setupMenu, enableAsMenuTrigger, menuCss } from "./menu";
import { rectKeyword } from "./rect";

const clickInsideShape = (draw: SVG, event: MouseEvent) => {
    /* assumes its rect */
    const rect = Rect.wrap(event.target as SVGRectElement);

    if (event.shiftKey) {
        draw.remove(rect);
        return;
    }

    const reverser = reverseEffects(window.getComputedStyle(draw.image));
    const [downX, downY] = reverser(getOffsets(event));

    const resizeParameters = getResizeParameters(rect, downX, downY);

    const action = resizeParameters.includes(true)
        ? onMouseMoveResize(reverser, rect, ...resizeParameters)
        : onMouseMoveMove(reverser, rect, rect.x, rect.y, downX, downY);

    draw.svg.addEventListener("mousemove", action);
    draw.svg.addEventListener(
        "mouseup",
        (innerEvent: MouseEvent) => {
            innerEvent.preventDefault();
            draw.svg.removeEventListener("mousemove", action);
        },
        { once: true },
    );
};

const makeInteractive = (draw: SVG, newRect: Rect): void => {
    const reverser = reverseEffects(window.getComputedStyle(draw.image));
    newRect.rect.addEventListener("mousemove", adaptCursor(reverser, newRect));

    const shapeMenu = setupMenu("occlusion-shape-menu", [
        {
            label: "Change Label",
            itemId: "change-label",
            clickEvent: () => {
                const newLabel = prompt(
                    "Specify the new label",
                    newRect.labelText,
                );
                if (typeof newLabel === "string") {
                    newRect.labelText = newLabel;
                }
            },
        },
        {
            label: "Close Menu",
            itemId: "close-occlusion-menu",
        },
    ]);
    enableAsMenuTrigger(shapeMenu, newRect.rect);

    draw.append(newRect);
};

const initRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    labelText: string,
) => {
    const result = Rect.make();
    result.pos = [x, y, width, height];
    result.labelText = labelText;
    result.classes = "closet-rect__rect";
    result.labelClasses = "closet-rect__label";

    return result;
};

const initShape = (draw: SVG, shape: ShapeDefinition): void => {
    let labelTxt = null,
        x = null,
        y = null,
        width = null,
        height = null,
        newRect = null;

    const [shapeType /* active */, , ...rest] = shape;

    switch (shapeType) {
        case "rect":
            [labelTxt, x, y, width, height] = rest;

            newRect = initRect(x, y, width, height, labelTxt);
            makeInteractive(draw, newRect);
            break;

        default:
        // no other shapes yet
    }
};

const clickOutsideShape = (draw: SVG, event: MouseEvent) => {
    const reverser = reverseEffects(window.getComputedStyle(draw.image));
    const [downX, downY] = reverser(getOffsets(event));

    const nextNum = draw.getNextNum(event);
    const newRect = initRect(downX, downY, 0, 0, `rect${nextNum}`);
    makeInteractive(draw, newRect);

    const resizer = onMouseMoveResize(
        reverser,
        newRect,
        true,
        true,
        true,
        true,
        downX,
        downY,
    );

    draw.svg.addEventListener("mousemove", resizer);
    draw.svg.addEventListener("mouseup", () => {
        draw.svg.removeEventListener("mousemove", resizer);
        newRect.readjust(draw);
    });
};

const occlusionLeftClick = (draw: SVG, event: MouseEvent) => {
    event.preventDefault();

    const click =
        (event.target as Element).nodeName !== "svg"
            ? clickInsideShape
            : clickOutsideShape;

    click(draw, event);
};

type MenuHandler = (menu: MenuItem[]) => MenuItem[];

type PartialShapeHandler = (shapes: Shape[], draw: SVG) => void;
type ShapeHandler = <T extends Record<string, unknown>>(
    entry: AftermathEntry<T>,
    internals: AftermathInternals<T>,
) => PartialShapeHandler;

type PartialShapeFilter = (
    shapes: ShapeDefinition[],
    draw: SVG,
) => ShapeDefinition[];
type ShapeFilter = <T extends Record<string, unknown>>(
    entry: AftermathEntry<T>,
    internals: AftermathInternals<T>,
) => PartialShapeFilter;

const makeOcclusionMenu = (
    target: EventTarget,
    setupOcclusionMenu: MenuHandler,
): HTMLElement => {
    const acceptEventHandler = (event: MouseEvent) => {
        event.preventDefault();
        target.dispatchEvent(new Event("accept"));
    };

    const occlusionMenu = setupOcclusionMenu([
        {
            label: "Accept occlusions",
            itemId: "occlusion-accept",
            clickEvent: acceptEventHandler,
        },
        {
            label: "Close Menu",
            itemId: "close-occlusion-menu",
        },
    ]);

    return setupMenu("occlusion-menu", occlusionMenu);
};

const wrapForOcclusion = (draw: SVG, menu: HTMLElement): void => {
    const occlusionClick = (event: MouseEvent) => {
        if (event.button === 0 /* left mouse button */) {
            occlusionLeftClick(draw, event);
        }
    };

    draw.svg.addEventListener("mousedown", occlusionClick);

    enableAsMenuTrigger(menu, draw.svg);
};

const defaultAcceptHandler: ShapeHandler = (_entry, internals) => (shapes) => {
    // window needs active focus for thi
    navigator.clipboard
        .writeText(
            shapes
                .map((shape) =>
                    shape.toText(internals.template.parser.delimiters),
                )
                .join("\n"),
        )
        .catch(() =>
            console.log("Window needs active focus for copying to clipboard"),
        );
};

const defaultRejectHandler: ShapeHandler = () => (
    _shapes: Shape[],
    draw: SVG,
) => draw.cleanup();

const occlusionCss = `
.closet-occlusion-container {
  outline: 3px dotted hotpink;
  outline-offset: -3px;
}`;

const occlusionMakerCssKeyword = "occlusionMakerCss";

export const occlusionMakerRecipe = <T extends Record<string, unknown>>(
    options: {
        tagname?: string;
        maxOcclusions?: number;
        acceptHandler?: ShapeHandler;
        rejectHandler?: ShapeHandler;
        setupOcclusionMenu?: MenuHandler;
        existingShapesFilter?: ShapeFilter;
        shapeKeywords?: string[];
    } = {},
) => (registrar: Registrar<T>) => {
    const keyword = "makeOcclusions";
    const target = new EventTarget();

    const {
        tagname = keyword,
        maxOcclusions = 500,
        acceptHandler = defaultAcceptHandler,
        rejectHandler = defaultRejectHandler,
        setupOcclusionMenu = id,
        existingShapesFilter = () => id,
        shapeKeywords = [rectKeyword],
    } = options;

    const occlusionMakerFilter = (_tag: TagNode, internals: Internals<T>) => {
        const template = internals.template as BrowserTemplate;
        const images = getImagesFromTemplate(template);

        internals.aftermath.registerIfNotExists(
            keyword,
            (entry, internals) => {
                const existingShapes: any[] = [];
                for (const kw of shapeKeywords) {
                    // get shapes for editing
                    const otherShapes = internals.cache.get<Shape[]>(kw, []);
                    existingShapes.push(...otherShapes);

                    // block aftermath render action
                    internals.aftermath.block(kw);
                }

                const callback = (event: Event): void => {
                    const image = event.target as HTMLImageElement;
                    const template = internals.template as BrowserTemplate;

                    template.appendDocumentStyle(
                        occlusionMakerCssKeyword,
                        menuCss,
                    );
                    template.appendStyle(
                        image,
                        occlusionMakerCssKeyword,
                        occlusionCss,
                    );
                    template.appendStyle(image, svgKeyword, svgCss);

                    const draw = SVG.wrapImage(image);
                    draw.setMaxOcclusions(maxOcclusions);

                    existingShapesFilter(entry as any, internals)(
                        existingShapes,
                        draw,
                    ).forEach((definition: ShapeDefinition) =>
                        initShape(draw, definition),
                    );

                    const acceptEvent = () => {
                        acceptHandler(entry as any, internals)(
                            draw.getElements(),
                            draw,
                        );
                    };

                    const rejectEvent = () => {
                        rejectHandler(entry as any, internals)(
                            draw.getElements(),
                            draw,
                        );
                    };

                    target.addEventListener("accept", acceptEvent);
                    target.addEventListener("reject", rejectEvent);

                    const menu = makeOcclusionMenu(target, setupOcclusionMenu);
                    wrapForOcclusion(draw, menu);
                };

                for (const [srcUrl, root] of images) {
                    imageLoadCallback(`img[src="${srcUrl}"]`, root, callback);
                }
            },
            {
                priority: 100 /* before any other occlusion aftermath */,
            },
        );

        return { ready: true };
    };

    registrar.register(tagname, occlusionMakerFilter);
    return target;
};
