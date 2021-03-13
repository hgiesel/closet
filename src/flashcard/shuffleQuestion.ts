import type {
    Un,
    TagNode,
    Internals,
    Eval,
    Recipe,
    InactiveBehavior,
    WeakFilter,
} from "../types";
import type { SortInStrategy } from "../sortInStrategies";
import type { StyleList } from "../styleList";
import type { FlashcardTemplate, FlashcardPreset } from "./flashcardTemplate";
import type { Optic } from "../template/optics";

import { listStylize, listStylizeMaybe } from "../styleList";
import {
    makeFlashcardTemplate,
    generateFlashcardRecipes,
} from "./flashcardTemplate";

import { Stylizer } from "../stylizer";
import { acrossTag } from "../sequencers";
import { topUp } from "../sortInStrategies";
import { separated } from "../template/optics";

const justValues = <T extends Un>(tag: TagNode, _internals: Internals<T>) =>
    tag.values;

const mapper = (name: string) => (s: string) =>
    `<span class="closet-${name}__item">${s}</span>`;
const separator = (name: string) =>
    `<span class="closet-${name}__separator"></span>`;

const ellipsis = (name: string) => () =>
    `<span class="closet-${name} is-inactive"><span class="closet-${name}__ellipsis"></span></span>`;

const inactive = (name: string): Stylizer =>
    Stylizer.make({
        processor: (s: string) =>
            `<span class="closet-${name} is-inactive">${s}</span>`,
        mapper: mapper(name),
        separator: separator(name),
    });

const active = (name: string): Stylizer =>
    Stylizer.make({
        processor: (s: string) =>
            `<span class="closet-${name} is-active">${s}</span>`,
        mapper: mapper(name),
        separator: separator(name),
    });

const valuesInOrder = (tag: TagNode): StyleList =>
    tag.values ? tag.values : [];

const simplyShow = <T extends Un, V extends StyleList>(
    stylizer: Stylizer,
    _shuffler: Eval<T, V | void>,
) => listStylize(stylizer, justValues);

const clozeOptics = [separated({ sep: "::" })];

const oneSidedShufflePublicApi = <
    T extends FlashcardPreset,
    V extends StyleList
>(
    internalName: string,
    frontActive: (
        stylizer: Stylizer,
        shuffler: Eval<T, V | void>,
    ) => WeakFilter<T>,
    backActive: (
        stylizer: Stylizer,
        shuffler: Eval<T, V | void>,
    ) => WeakFilter<T>,
) => (
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (
    options: {
        tagname?: string;

        activeStylizer?: Stylizer;
        inactiveStylizer?: Stylizer;

        contexter?: Eval<T, V>;
        ellipser?: WeakFilter<T>;

        sequence?: (
            getValues: Eval<T, V>,
            sortIn: SortInStrategy,
        ) => Eval<T, V | void>;

        sortInStrategy?: SortInStrategy;
        optics?: Optic[];
        flashcardTemplate?: FlashcardTemplate<T>;
    } = {},
) => {
    const {
        tagname = "shuf",

        activeStylizer = active(internalName),
        inactiveStylizer = inactive(internalName),

        contexter = valuesInOrder,
        ellipser = ellipsis(internalName),

        sequence = acrossTag,
        sortInStrategy = topUp,

        optics = clozeOptics,
        flashcardTemplate = makeFlashcardTemplate(),
    } = options;

    const clozeOptions = { optics };

    const shuffler: Eval<T, V> = sequence(
        contexter as any,
        sortInStrategy,
    ) as Eval<T, V>;

    const front = frontActive(activeStylizer, shuffler);
    const back = backActive(activeStylizer, shuffler);

    const trueContexter = listStylize(inactiveStylizer, contexter);

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive);
    return clozeRecipe(
        tagname,
        front,
        back,
        trueContexter,
        ellipser,
        clozeOptions,
    );
};

export const mingleRecipes = generateFlashcardRecipes(
    oneSidedShufflePublicApi("mingle", listStylizeMaybe, listStylizeMaybe),
);
export const sortRecipes = generateFlashcardRecipes(
    oneSidedShufflePublicApi("sort", listStylizeMaybe, simplyShow),
);
export const jumbleRecipes = generateFlashcardRecipes(
    oneSidedShufflePublicApi("jumble", simplyShow, listStylizeMaybe),
);
