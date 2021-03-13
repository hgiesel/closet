import type { Registrar, TagNode, Internals, Eval } from "../../types";
import type { CardPreset } from "../../flashcard/flashcardTemplate";
import type { ListStore } from "./listStore";

import { numberGenerator, intAlgorithm, intStop } from "../../generator";

import { listStoreTemplate } from "./listStore";

const defaultPostprocess = <T extends Record<string, unknown>>(
    value: string,
    _valueList: string[],
): Eval<T, string> => (_tag: TagNode, _internals: Internals<T>): string =>
    value;

const pickIndex = <T extends Record<string, unknown>>(
    picker: (valueList: string[], key: string) => Eval<T, string>,
    postprocess: (value: string, valueList: string[]) => Eval<T, string>,
) => (tag: TagNode, internals: Internals<T>) => (
    listStore: ListStore,
): string => {
    const key = tag.values || /* in case it is '' */ "default";

    const valueList = listStore.getList(key);
    const value = picker(valueList, key)(tag, internals);

    return postprocess(value, valueList)(tag, internals as any);
};

const pickIndexTemplate = <T extends Record<string, unknown>>(
    picker: (list: string[], key: string) => Eval<T, string>,
) => ({
    tagname = "pick",
    storeId = "lists",
    postprocess = defaultPostprocess,
} = {}) => (registrar: Registrar<T>) =>
    registrar.register(
        tagname,
        listStoreTemplate(
            storeId,
            pickIndex(picker as any, postprocess) as any,
        ),
    );

const pickRandom = (list: string[], key: string) => <
    T extends Record<string, unknown>
>(
    tag: TagNode,
    { memory }: Internals<T>,
) => {
    const pickedKey = `pick:picked:${tag.fullKey}:${tag.occur}`;

    const index = memory.lazy(pickedKey, () => {
        const algorithm = intAlgorithm(0, list.length);
        const stopper = intStop(0, list.length);

        // tag.num is used to decide uniqList
        const filter = Boolean(tag.num /* 0 is falsy */);
        const filterKey = `pick:uniqList:${tag.fullKey}`;

        const uniqList: number[] = filter
            ? memory.over(
                  filterKey,
                  (
                      uniqHash: Record<string, number[]>,
                  ): Record<string, number[]> => {
                      if (
                          !Object.prototype.hasOwnProperty.call(uniqHash, key)
                      ) {
                          uniqHash[key] = [];
                      }

                      return uniqHash;
                  },
                  {},
              )[key]
            : [];

        const emptyIndices = Array.from(list).reduce(
            (
                accu: number[],
                value: string | undefined,
                index: number,
            ): number[] => {
                if (value === undefined) {
                    accu.push(index);
                }

                return accu;
            },
            [],
        );

        const banList = uniqList.concat(emptyIndices);

        const generator = numberGenerator(algorithm, filter, banList, stopper);

        const picked = generator.next();

        if (!picked.done) {
            uniqList.push(picked.value);
            return picked.value;
        }
    });

    return Number.isInteger(index) ? list[index as number] : "";
};

const pickNum = (list: string[], _key: string) => <
    T extends Record<string, unknown>
>(
    tag: TagNode,
    _internals: Internals<T>,
): string => list[Number(tag.num) || 0];

const pickCardNumber = (list: string[], _key: string) => <T extends CardPreset>(
    _tag: TagNode,
    internals: Internals<T>,
): string => {
    const indexedValue: string | undefined =
        list[internals.preset.cardNumber as number];
    const result: string = indexedValue ?? list[0] ?? "";

    return result;
};

export const pickRandomRecipe = pickIndexTemplate(pickRandom);
export const pickIndexRecipe = pickIndexTemplate(pickNum);
export const pickCardNumberRecipe = pickIndexTemplate(pickCardNumber);
