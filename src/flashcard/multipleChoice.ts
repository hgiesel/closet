import type {
    TagNode,
    Recipe,
    Eval,
    InactiveBehavior,
    WeakFilter,
} from "../types";
import type { SortInStrategy } from "../sortInStrategies";
import type { StyleList } from "../styleList";
import type { FlashcardPreset, FlashcardTemplate } from "./flashcardTemplate";
import type { Optic } from "../template/optics";

import { separated, mapped } from "../template/optics";

import { constant } from "../utils";
import { Stylizer } from "../stylizer";
import { acrossTag } from "../sequencers";
import { listStylize, listStylizeMaybe } from "../styleList";
import { topUp } from "../sortInStrategies";

import {
    makeFlashcardTemplate,
    generateFlashcardRecipes,
} from "./flashcardTemplate";

type ValuePlusCategory = [string, number];

const ellipsis = constant(
    '<span class="closet-multiple-choice is-inactive"><span class="closet-multiple-choice__ellipsis"></span></span>',
);

const valuesWithIndex = (tag: TagNode): ValuePlusCategory[] =>
    tag.values
        ? tag.values.flatMap((v: string[], i: number) =>
              v.map((w: string) => [w, i]),
          )
        : [];

const firstCategory = (tag: TagNode): string[] => tag.values[0];

const separator = `<span class="closet-multiple-choice__separator"></span>`;

const inactive = Stylizer.make({
    processor: (s: string) =>
        `<span class="closet-multiple-choice is-inactive">${s}</span>`,
    mapper: (s: string) =>
        `<span class="closet-multiple-choice__item">${s}</span>`,
    separator,
});

const active = (side: string) => (s: string) =>
    `<span class="closet-multiple-choice is-active is-${side}">${s}</span>`;
const activeFront = Stylizer.make({
    processor: active("front"),
    mapper: (s: string) =>
        `<span class="closet-multiple-choice__item closet-multiple-choice__option">${s}</span>`,
    separator,
});

const activeBack = Stylizer.make({
    processor: active("back"),
    mapper: (v: string, _i, t: number) =>
        `<span class="closet-multiple-choice__item closet-multiple-choice__${
            t === 0 ? "correct" : "wrong"
        }">${v}</span>`,
    separator,
});

const multipleChoiceOptics = [
    separated({
        sep: "::",
    }),
    mapped(),
    separated({
        sep: "||",
        keepEmpty: false,
    }),
];

const multipleChoicePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => <V extends StyleList>(
    options: {
        tagname?: string;

        frontStylizer?: Stylizer;
        backStylizer?: Stylizer;

        inactiveStylizer?: Stylizer;
        contexter?: Eval<T, V>;
        ellipser?: WeakFilter<T>;

        getValues?: Eval<T, V>;
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
        tagname = "mc",

        frontStylizer = activeFront,
        backStylizer = activeBack,

        inactiveStylizer = inactive,
        contexter = firstCategory,
        ellipser = ellipsis,

        getValues = valuesWithIndex,

        sequence = acrossTag,
        sortInStrategy = topUp,

        optics = multipleChoiceOptics,

        flashcardTemplate = makeFlashcardTemplate(),
    } = options;

    const shuffler: Eval<T, V | void> = sequence(
        getValues as any,
        sortInStrategy,
    ) as Eval<T, V | void>;

    const front = listStylizeMaybe(frontStylizer, shuffler);
    const back = listStylizeMaybe(backStylizer, shuffler);

    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive);

    const trueContexter = listStylize(inactiveStylizer, contexter);
    const dataOptions = { optics };

    return multipleChoiceRecipe(
        tagname,
        front,
        back,
        trueContexter,
        ellipser,
        dataOptions,
    );
};

export const multipleChoiceRecipes = generateFlashcardRecipes(
    multipleChoicePublicApi,
);
