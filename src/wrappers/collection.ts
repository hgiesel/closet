import type { Registrar, Recipe, WrapOptions } from "../types";

import { defaultTagnameGetter, defaultTagnameSetter } from "./wrappers";

type RecipePart<T extends Record<string, unknown>> = [
    Recipe<T>,
    Partial<WrapOptions>,
];

export const collection = <T extends Record<string, unknown>>(
    recipeParts: RecipePart<T>[],
): Recipe<T> => (options?: Record<string, unknown>) => (
    registrar: Registrar<T>,
) => {
    const theOptions = options ?? {};

    for (const [recipe, wrapOptions = {}] of recipeParts) {
        const {
            setTagnames = defaultTagnameSetter,
            getTagnames = defaultTagnameGetter,
        } = wrapOptions;

        recipe(setTagnames(theOptions, getTagnames(theOptions)))(registrar);
    }
};
