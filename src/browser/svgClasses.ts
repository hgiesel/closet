import type { Delimiters } from "../template/delimiters";

import type {
    TagNode,
    Internals,
    Un,
} from "../types";

import { getHighestNum } from "./utils";

const ns = "http://www.w3.org/2000/svg";

export type RectProperty =
    | "classes"
    | "labelClasses"
    | "containerClasses"
    | "rx"
    | "ry"
    | "fill"
    | "fillOpacity"
    | "stroke"
    | "strokeOpacity"
    | "strokeWidth";

export type RectProperties = Partial<Record<RectProperty, string>>;
export type RectPropertyGetter = <T extends Un>(tag: TagNode, internals: Internals<T>) => RectProperties;

export type RectDefinition = [
    "rect",
    boolean | undefined,
    string,
    number,
    number,
    number,
    number,
    RectProperties,
];

export type ShapeDefinition = RectDefinition;

export interface Shape {
    getElements(): Element[];
    /**
     * all elements that need to be put into svg container
     */

    getAnchorElement(): Element;
    /**
     * the "anchor" element should be the one used in the "wrap" command
     * can be used to locate all other svgs related to that shape
     */

    getLabel(): string;

    resize(forSVG: SVG): void;
    readjust(forSVG: SVG): void;

    toDefinition(): ShapeDefinition;
    toText(delimiters: Delimiters): string;
}

export class SVG {
    readonly container: HTMLDivElement;
    readonly image: HTMLImageElement;
    readonly svg: SVGElement;

    protected scaleFactorX = 1;
    protected scaleFactorY = 1;
    protected maxOcclusions = 500;

    protected elements: Shape[] = [];
    protected resizer: any; /* ResizeObserver */

    protected constructor(
        container: HTMLDivElement,
        image: HTMLImageElement,
        svg: SVGElement,
    ) {
        this.container = container;
        this.image = image;
        this.svg = svg;

        this.resizer = new (globalThis as any).ResizeObserver(() =>
            this.resize(),
        );
        this.resizer.observe(image);

        this.setScaleFactors();
    }

    protected setScaleFactors(): void {
        this.scaleFactorX = this.image.width / this.image.naturalWidth;
        this.scaleFactorY = this.image.height / this.image.naturalHeight;
    }

    static wrapImage(image: HTMLImageElement): SVG {
        const container = document.createElement("div");

        image.parentNode && image.parentNode.replaceChild(container, image);
        container.appendChild(image);

        const svg = document.createElementNS(ns, "svg");
        svg.setAttributeNS(null, "width", "100%");
        svg.setAttributeNS(null, "height", "100%");

        // Adopt images zoom and transform attributes
        // both can be used to scale
        const imageStyle = window.getComputedStyle(image);
        svg.style.zoom = imageStyle.getPropertyValue("zoom");
        svg.style.transform = imageStyle.getPropertyValue("transform");

        container.appendChild(svg);
        container.classList.add("closet-occlusion-container");

        return new SVG(container, image, svg);
    }

    get scaleFactors(): [number, number] {
        return [this.scaleFactorX, this.scaleFactorY];
    }

    resize(): void {
        this.setScaleFactors();

        if (this.scaleFactors.includes(0)) {
            // image is not displayed anymore
            this.resizer.disconnect();
            return;
        }

        for (const elem of this.elements) {
            elem.resize(this);
        }
    }

    append(element: Shape): void {
        this.elements.push(element);

        for (const elem of element.getElements()) {
            this.svg.appendChild(elem);
        }
    }

    getElements(): Shape[] {
        return this.elements;
    }

    getLabels(): string[] {
        return this.getElements().map((element) => element.getLabel());
    }

    remove(shape: Shape): void {
        this.elements.find((elem, index) => {
            if (elem.getAnchorElement() === shape.getAnchorElement()) {
                for (const elem of shape.getElements()) {
                    elem.remove();
                }

                this.elements.splice(index, 1);
                return true;
            }
        });
    }

    setMaxOcclusions(maxOcclusions: number): void {
        this.maxOcclusions = maxOcclusions;
    }

    getNextNum(event: MouseEvent): number {
        const increment = event.altKey ? 0 : 1;

        const maybeCurrentNum = Math.max(
            1,
            getHighestNum(this.getLabels()) + increment,
        );

        const currentNum =
            maybeCurrentNum > this.maxOcclusions ? 0 : maybeCurrentNum;

        return currentNum;
    }

    cleanup(): void {
        const image = this.container.removeChild(this.image);
        this.container.replaceWith(image);
    }
}

export class Rect implements Shape {
    readonly container: SVGElement;
    readonly rect: SVGRectElement;
    readonly label: SVGTextElement;

    protected scaleFactorX = 1;
    protected scaleFactorY = 1;

    protected constructor(
        container: SVGElement,
        rect: SVGRectElement,
        label: SVGTextElement,
        scaleFactorX: number,
        scaleFactorY: number,
    ) {
        this.container = container;
        this.rect = rect;
        this.label = label;

        this.setScaleFactors(scaleFactorX, scaleFactorY);
    }

    static make(forSVG?: SVG): Rect {
        const container = document.createElementNS(ns, "svg");
        const rect = document.createElementNS(ns, "rect");
        const label = document.createElementNS(ns, "text");

        container.appendChild(rect);
        container.appendChild(label);
        container.classList.add("closet-rect");
        container.classList.add("closet-shape");

        container.tabIndex = -1;

        const [scaleFactorX, scaleFactorY] = forSVG
            ? forSVG.scaleFactors
            : [1, 1];

        const theRect = new Rect(
            container,
            rect,
            label,
            scaleFactorX,
            scaleFactorY,
        );

        return theRect;
    }

    static wrap(rect: SVGRectElement, forSVG?: SVG): Rect {
        const [scaleFactorX, scaleFactorY] = forSVG
            ? forSVG.scaleFactors
            : [1, 1];

        return new Rect(
            (rect.parentElement as unknown) as SVGElement,
            rect,
            rect.nextSibling as SVGTextElement,
            scaleFactorX,
            scaleFactorY,
        );
    }

    remove(): void {
        this.container.remove();
    }

    getElements(): Element[] {
        return [this.container];
    }

    getAnchorElement(): Element {
        return this.rect;
    }

    getLabel(): string {
        return this.labelText;
    }

    setScaleFactors(x: number, y: number): void {
        this.scaleFactorX = x;
        this.scaleFactorY = y;
    }

    readjust(forSVG?: SVG): [number, number] {
        const scaleFactors = forSVG ? forSVG.scaleFactors : [1, 1];

        const saveX = this.scaleFactorX;
        const saveY = this.scaleFactorY;

        this.setScaleFactors(scaleFactors[0], scaleFactors[1]);

        return [saveX, saveY];
    }

    resize(forSVG?: SVG): void {
        const savePos = this.pos;
        this.readjust(forSVG);
        this.pos = savePos;
    }

    toDefinition(): RectDefinition {
        return [
            "rect",
            undefined,
            this.labelText,
            this.x,
            this.y,
            this.width,
            this.height,
            {},
        ];
    }

    toText(delimiters: Delimiters): string {
        return `${delimiters.open}${this.labelText}${
            delimiters.sep
        }${this.x.toFixed()},${this.y.toFixed()},${this.width.toFixed()},${this.height.toFixed()}${
            delimiters.close
        }`;
    }

    fontSizeUpdate(): void {
        const [saveX, saveY] = this.readjust();

        const fontSizeEstimate = Math.max(
            0.1,
            Math.min(
                32,
                0.4 * ((this.width + this.height) / 2 - 2 * this.strokeWidth),
            ),
        );

        this.fontSize = fontSizeEstimate;
        this.setScaleFactors(saveX, saveY);
    }

    /////////////////// on both

    get pos(): [number, number, number, number] {
        return [this.x, this.y, this.width, this.height];
    }
    set pos([x, y, width, height]: [number, number, number, number]) {
        // NOTE: width and height need to be set first, because x/y are dependent on them
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    get scaled(): [number, number, number, number] {
        return [
            Number(this.rect.getAttributeNS(null, "x")),
            Number(this.rect.getAttributeNS(null, "y")),
            Number(this.rect.getAttributeNS(null, "width")),
            Number(this.rect.getAttributeNS(null, "height")),
        ];
    }

    /////////////////// internal functions, prefer using pos() / scaled()

    get x(): number {
        return Number(this.rect.getAttributeNS(null, "x")) / this.scaleFactorX;
    }
    set x(i: number) {
        const scaledX = i * this.scaleFactorX;
        const scaledForLabelX = (i + this.width / 2) * this.scaleFactorX;

        this.rect.setAttributeNS(null, "x", String(scaledX));
        this.label.setAttributeNS(null, "x", String(scaledForLabelX));
    }

    get y(): number {
        return Number(this.rect.getAttributeNS(null, "y")) / this.scaleFactorY;
    }
    set y(i: number) {
        const scaledY = i * this.scaleFactorY;
        const scaledForLabelY = (i + this.height / 2) * this.scaleFactorY;

        this.rect.setAttributeNS(null, "y", String(scaledY));
        this.label.setAttributeNS(null, "y", String(scaledForLabelY));
    }

    get width(): number {
        return (
            Number(this.rect.getAttributeNS(null, "width")) / this.scaleFactorX
        );
    }
    set width(i: number) {
        const stringified = String(Math.max(10, i) * this.scaleFactorX);
        this.rect.setAttributeNS(null, "width", stringified);
        this.label.setAttributeNS(null, "width", stringified);
        this.fontSizeUpdate();
    }

    get height(): number {
        return (
            Number(this.rect.getAttributeNS(null, "height")) / this.scaleFactorY
        );
    }
    set height(i: number) {
        const stringified = String(Math.max(10, i) * this.scaleFactorY);
        this.rect.setAttributeNS(null, "height", stringified);
        this.label.setAttributeNS(null, "height", stringified);
        this.fontSizeUpdate();
    }

    /////////////////// styling

    props(attrs: RectProperties): void {
        for (const key in attrs) {
            const propName = key as RectProperty;
            this.prop(propName, attrs[propName] as string);
        }
    }

    prop(attr: RectProperty, value: string): void {
        (this[attr] as any) = value;
    }

    /////////////////// on container

    set containerClasses(txt: string) {
        txt.split(" ").forEach((cls: string) =>
            this.container.classList.add(cls),
        );
    }
    get containerClasses(): string {
        return Array.from(this.container.className).join(" ");
    }

    /////////////////// on rect

    set rx(i: number) {
        this.rect.setAttributeNS(null, "rx", String(i));
    }
    get rx(): number {
        return Number(this.rect.getAttributeNS(null, "rx"));
    }

    set ry(i: number) {
        this.rect.setAttributeNS(null, "ry", String(i));
    }
    get ry(): number {
        return Number(this.rect.getAttributeNS(null, "ry"));
    }

    set fill(color: string) {
        this.rect.setAttributeNS(null, "fill", color);
    }
    get fill(): string {
        return this.rect.getAttributeNS(null, "fill") ?? "";
    }

    set fillOpacity(i: number) {
        this.rect.setAttributeNS(null, "fill-opacity", String(i));
    }
    get fillOpacity(): number {
        return Number(this.rect.getAttributeNS(null, "fill-opacity"));
    }

    set stroke(color: string) {
        this.rect.setAttributeNS(null, "stroke", color);
    }
    get stroke(): string {
        return this.rect.getAttributeNS(null, "stroke") ?? "";
    }

    set strokeOpacity(i: number) {
        this.rect.setAttributeNS(null, "stroke-opacity", String(i));
    }
    get strokeOpacity(): number {
        return Number(this.rect.getAttributeNS(null, "stroke-opacity"));
    }

    set strokeWidth(i: number) {
        this.rect.setAttributeNS(null, "stroke-width", String(i));
    }
    get strokeWidth(): number {
        return Number(this.rect.getAttributeNS(null, "stroke-width"));
    }

    set classes(txt: string) {
        txt.split(" ").forEach((cls: string) => this.rect.classList.add(cls));
    }
    get classes(): string {
        return Array.from(this.rect.classList).join(" ");
    }

    /////////////////// on label

    set labelText(txt: string) {
        this.label.innerHTML = txt;
    }
    get labelText(): string {
        return this.label.innerHTML;
    }

    set fontSize(i: number) {
        this.label.setAttributeNS(null, "font-size", String(i));
    }
    get fontSize(): number {
        return Number(this.label.getAttributeNS(null, "font-size"));
    }

    set labelClasses(txt: string) {
        txt.split(" ").forEach((cls: string) => this.label.classList.add(cls));
    }
    get labelClasses(): string {
        return Array.from(this.label.classList).join(" ");
    }
}
