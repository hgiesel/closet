import type { Registrar } from "../../types";

import {
    PreferenceStore,
    storeTemplate,
    defaultSeparated,
    innerSeparated,
} from "./storeTemplate";

import { mapped } from "../../template/optics";

class NumberStore extends PreferenceStore<number> {
    setNumber(selector: string, value: number): void {
        this.set(selector, Number.isNaN(value) ? 0 : value);
    }
}

const numStoreFilterTemplate = storeTemplate(NumberStore);

export const setNumberRecipe = <T extends Record<string, unknown>>({
    tagname = "set",
    storeId = "numerical",
    separator = defaultSeparated,
    assignmentSeparator = innerSeparated,
} = {}) => (registrar: Registrar<T>) =>
    registrar.register(
        tagname,
        numStoreFilterTemplate(storeId, 0, (selector, val) => (numberMap) =>
            numberMap.setNumber(selector, Number(val)),
        ),
        {
            optics: [separator, mapped(), assignmentSeparator],
        },
    );
