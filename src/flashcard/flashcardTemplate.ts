import type {
    TagNode,
    Internals,
    Registrar,
    Recipe,
    Eval,
    InactiveBehavior,
    InactiveAdapter,
    DataOptions,
    WeakFilter,
    RecipeOptions,
} from "../types";

import { id, id2, constant } from "../utils";
import { simpleRecipe as simple } from "../recipes/simple";
import { sumFour } from "../wrappers/sum";
import { collection } from "../wrappers/collection";

import { isActiveAll, isBackAll } from "./deciders";
import { inactiveAdapterAll } from "./inactiveAdapter";

export type FlashcardTemplate<T extends FlashcardPreset> = (
    f2: InactiveBehavior<T>,
    b2: InactiveBehavior<T>,
) => (
    tagname: string,
    front: WeakFilter<T>,
    back: WeakFilter<T>,
    contexter: WeakFilter<T>,
    inactive: WeakFilter<T>,
    dataOptions: Partial<DataOptions>,
) => (registrar: Registrar<T>) => void;

export interface CardPreset {
    cardNumber: number;
    [v: string]: unknown;
}

export interface SidePreset {
    side: "front" | "back";
    [v: string]: unknown;
}

export type FlashcardPreset = CardPreset & SidePreset;

export const makeFlashcardTemplate = <T extends FlashcardPreset>(
    isActive: Eval<T, boolean> = isActiveAll,
    isBack: Eval<T, boolean> = isBackAll,
    inactiveAdapter: InactiveAdapter<T> = inactiveAdapterAll,
): FlashcardTemplate<T> => (
    frontInactiveBehavior: InactiveBehavior<T>,
    backInactiveBehavior: InactiveBehavior<T>,
) => (
    tagname: string,
    // highlight it, show the question (e.g. hint for cloze; answer choices for multiple choice)
    front: WeakFilter<T>,
    // highlight it, show the answer (e.g. unobscure occlusions)
    back: WeakFilter<T>,
    // provide context for the rest of the question (e.g. show the answer of a cloze; unobscure occlusion)
    contexter: WeakFilter<T>,
    // render it inactive, avoid giving away too much context for answering (e.g. an ellipsis)
    inactive: WeakFilter<T>,
    dataOptions: Partial<DataOptions> = {},
) => (registrar: Registrar<T>) => {
    const internalFilter = `${tagname}:internal`;

    const flashcardRecipe = sumFour(
        // isInactive isFront behavior
        simple(
            inactiveAdapter(frontInactiveBehavior)(contexter, inactive),
        ),
        // isActive isFront behavior
        simple(front),
        // isInctive isBack behavior
        simple(
            inactiveAdapter(backInactiveBehavior)(contexter, inactive),
        ),
        // isActive isBack behavior
        simple(back),
        isActive,
        isBack,
    );

    flashcardRecipe({ tagname: internalFilter })(registrar);

    const flashcardFilter = (tag: TagNode, inter: Internals<T>) => {
        return inter.filters.getOrDefault(internalFilter)(tag, inter);
    };

    registrar.register(tagname, flashcardFilter, dataOptions);
};

export const ellipsis = constant("[...]");

export interface FlashcardRecipe<T extends Record<string, unknown>>
    extends Recipe<T> {
    (options?: Record<string, unknown>): (filters: Registrar<T>) => void;
    show: Recipe<T>;
    hide: Recipe<T>;
    reveal: Recipe<T>;
}

export enum FlashcardBehavior {
    Show = "show",
    Hide = "hide",
    Reveal = "reveal",
}

export const generateFlashcardRecipes = <T extends FlashcardPreset>(
    publicApi: (
        front: InactiveBehavior<T>,
        back: InactiveBehavior<T>,
    ) => Recipe<T>,
): FlashcardRecipe<T> => {
    const show = publicApi(id, id);
    const hide = publicApi(id2, id2);
    const reveal = publicApi(id2, id);

    const [showOptions, hideOptions, revealOptions] = [
        [FlashcardBehavior.Show, "s"],
        [FlashcardBehavior.Hide, "h"],
        [FlashcardBehavior.Reveal, "r"],
    ].map(([behavior, suffix]) => ({
        getTagnames: (options: RecipeOptions): string[] => [
            (options.defaultBehavior ?? FlashcardBehavior.Show) === behavior
                ? options.tagname
                : options.tagnameShow ?? `${options.tagname}${suffix}`,
        ],
    }));

    const col = collection([
        [hide, hideOptions],
        [show, showOptions],
        [reveal, revealOptions],
    ]) as FlashcardRecipe<T>;

    col.show = show;
    col.hide = hide;
    col.reveal = reveal;

    return col;
};
