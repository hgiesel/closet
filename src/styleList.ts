import type { Stylizer, Eval, TagNode, Internals, WeakFilter } from "./types";

const transpose = <T>(array: (T | T[])[]): T[][] =>
    Array.isArray(array[0])
        ? array[0].map((_, index) =>
              array.map((value: any /* T[] */) => value[index]),
          )
        : [array];

export type StyleList = (string | [string, ...any[]])[];

export const listStylize = <T extends Record<string, unknown>>(
    stylizer: Stylizer,
    toList: Eval<T, StyleList>,
): WeakFilter<T> => (tag: TagNode, internals: Internals<T>) =>
    internals.ready
        ? stylizer.stylize(
              ...(transpose(toList(tag, internals)) as [any, ...any[]]),
          )
        : { ready: false };

export const listStylizeMaybe = <T extends Record<string, unknown>>(
    stylizer: Stylizer,
    toListMaybe: Eval<T, StyleList | void>,
): WeakFilter<T> => (tag: TagNode, internals: Internals<T>) => {
    if (!internals.ready) {
        return { ready: false };
    }

    const maybeValues = toListMaybe(tag, internals);

    if (!maybeValues) {
        return { ready: false };
    }

    return stylizer.stylize(...(transpose(maybeValues) as [any, ...any[]]));
};
