import type { TagNode, Registrar, Internals, Eval, Un } from "../types";

import { Stylizer } from "../stylizer";
import { acrossNumberedTag } from "../sequencers";
import { topUp } from "../sortInStrategies";

import { separated } from "../template/optics";

const defaultStylizer = Stylizer.make({
    processor: (s: string) => `<span class="closet-shuffle">${s}</span>`,
    mapper: (s: string) => `<span class="closet-shuffle__item">${s}</span>`,
    separator: '<span class="closet-shuffle__separator"></span>',
});

const defaultEval = <T extends Un>(
    stylizer: Stylizer,
    mixedValues: string[],
): Eval<T, string> => (): string => stylizer.stylize(mixedValues);

const defaultOptics = [separated({ sep: "||" })];

export const shufflingRecipe = ({
    tagname = "mix",
    stylizer = defaultStylizer,
    evaluate = defaultEval,
    sortInStrategy = topUp,
    sequencer = acrossNumberedTag,
    optics = defaultOptics,
} = {}) => <T extends Un>(registrar: Registrar<T>) => {
    const shuffleFilter = (tag: TagNode, internals: Internals<T>) => {
        const getValues: Eval<T, string[]> = ({ values }: TagNode): string[] =>
            values ?? [];

        const shuffler: Eval<T, string[] | void> = sequencer(
            getValues as any,
            sortInStrategy,
        ) as Eval<T, string[] | void>;

        const maybeValues = shuffler(tag, internals);
        if (maybeValues) {
            return evaluate(stylizer, maybeValues)(tag, internals as any);
        }
    };

    registrar.register(tagname, shuffleFilter, { optics });
};
