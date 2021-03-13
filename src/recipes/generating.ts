import type { Registrar, TagNode, Internals } from "../types";
import type { NumberGenAlgorithm } from "../generator";

import {
    numberGenerator,
    intAlgorithm,
    intOutput,
    realAlgorithm,
    realOutput,
} from "../generator";

import { separated } from "../template/optics";

const generateOptics = [separated({ sep: "," })];

const generateTemplate = (
    algorithm: (min: number, max: number) => NumberGenAlgorithm,
    outputAlgorithm: (value: number, extra: number) => string,
    defaultExtra: number,
) => ({
    tagname = "gen",
    uniqueConstraintId = "uniq",
    optics = generateOptics,
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const uniqConstraintPrefix = `gen:${uniqueConstraintId}`;

    const generateFilter = (
        { values, fullOccur, num }: TagNode,
        { memory }: Internals<T>,
    ) => {
        const [min = 1, max = 100, extra = defaultExtra] =
            values.length === 1
                ? [1, Number(values[0]), defaultExtra]
                : values.map(Number);

        const uniqueConstraintId = Number.isInteger(num)
            ? `${uniqConstraintPrefix}:${num}`
            : uniqConstraintPrefix;

        const generateId = `gen:${tagname}:${fullOccur}`;

        const result = memory.lazy(generateId, (): string => {
            const gen = numberGenerator(
                algorithm(min, max),
                true,
                Number.isInteger(num) ? memory.get(uniqueConstraintId, []) : [],
            );

            const generated = gen.next();

            return generated.done
                ? ""
                : outputAlgorithm(generated.value as number, extra);
        });

        return { ready: true, result: result };
    };

    registrar.register(tagname, generateFilter, { optics });
};

export const generateInteger = generateTemplate(intAlgorithm, intOutput, 1);
export const generateReal = generateTemplate(realAlgorithm, realOutput, 2);
