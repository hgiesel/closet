import type { Registrar } from "../../types";

import {
    PreferenceStore,
    storeTemplate,
    defaultSeparated,
    innerSeparated,
} from "./storeTemplate";

import { mapped } from "../../template/optics";

class BoolStore extends PreferenceStore<boolean> {
    on(selector: string): void {
        this.set(selector, true);
    }

    off(selector: string): void {
        this.set(selector, false);
    }
}

const boolStoreFilterTemplate = storeTemplate(BoolStore);

export const activateRecipe = ({
    tagname = "on",
    storeId = "active",
    optic = defaultSeparated,
} = {}) => (registrar: Registrar<Record<string, unknown>>) =>
    registrar.register(
        tagname,
        boolStoreFilterTemplate(storeId, false, (selector) => (activateMap) => {
            activateMap.on(selector);
        }),
        {
            separators: [optic, mapped(), innerSeparated],
        },
    );

export const deactivateRecipe = <T extends Record<string, unknown>>({
    tagname = "off",
    storeId = "active",
    optic = defaultSeparated,
} = {}) => (registrar: Registrar<T>) =>
    registrar.register(
        tagname,
        boolStoreFilterTemplate(storeId, false, (selector) => (activateMap) =>
            activateMap.off(selector),
        ),
        {
            separators: [optic, mapped(), innerSeparated],
        },
    );
