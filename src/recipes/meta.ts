import type { Registrar, TagNode, WeakFilterResult } from "../types";

import { separated } from "../template/optics";

const paramPattern = /%(.)/gu;
const defOptions = {
    optics: [separated({ sep: "::", max: 2 })],
    capture: true,
};

const matcher = (tag: TagNode) => (match: string, p1: string) => {
    let num = null;

    switch (p1) {
        case "%":
            return p1;

        case "n":
            return typeof tag.num === "number" ? String(tag.num) : "";

        case "k":
            return tag.key;
        case "f":
            return tag.fullKey;

        default:
            num = Number(p1);

            return Number.isNaN(num) ? match : tag.values[num] ?? "";
    }
};

export const defRecipe = (
    options: {
        tagname?: string;
    } = {},
) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const { tagname = "def" } = options;

    const innerOptions = { optics: [separated({ sep: "::" })] };

    const defFilter = (tag: TagNode): WeakFilterResult => {
        const [definedTag, template] = tag.values;

        const innerFilter = (tag: TagNode) => {
            const result = template.replace(paramPattern, matcher(tag));

            return {
                result: result,
                parse: true,
            };
        };

        registrar.register(definedTag, innerFilter, innerOptions);

        return {
            ready: true,
        };
    };

    registrar.register(tagname, defFilter, defOptions);
};
