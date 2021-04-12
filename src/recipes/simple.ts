import type { TagNode, WeakFilter, Recipe, Registrar, Un } from "../types";

import { Stylizer } from "../stylizer";
import { id } from "../utils";
import { separated } from "../template/optics";


// Used for internals, for externals applyRecipe should be preferred
export const simpleRecipe = <T extends Un>(
    weakFilter: WeakFilter<T>,
): Recipe<T> => ({
    tagname = "s",
}: {
    tagname?: string,
} = {}) => (registrar: Registrar<T>) => {
    registrar.register(tagname, weakFilter);
};

const applyToValues = <T extends Un, V>(f: (v: V) => V): WeakFilter<T> => (tag: TagNode): V => f(tag.values)

export const applyRecipe = <T extends Un>({
    tagname = "s",
    apply = applyToValues<T, unknown>(id),
    optics = [],
} = {}) => (registrar: Registrar<T>) => {
    registrar.register(tagname, apply, { optics });
};

export const processRecipe = <T extends Un>({
    tagname = "s",
    processor = id,
    optics = [],
} = {}) => (registrar: Registrar<T>) => {
    registrar.register(tagname, applyToValues(processor), { optics });
};

export const styleRecipe = <T extends Un>({
    tagname = "s",
    stylizer = Stylizer.make(),
    optics = [separated("::")],
} = {}) => (registrar: Registrar<T>) => {
    registrar.register(tagname, applyToValues<T, any>(stylizer.stylize.bind(stylizer)), { optics });
};
