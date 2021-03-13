import type { Registrar, TagNode, Internals, Eval } from "../../types";
import type { CardPreset } from "../../flashcard/flashcardTemplate";
import type { ListStore } from "./listStore";

import { listStoreTemplate } from "./listStore";
import { separated, mapped } from "../../template/optics";

const discard = <T extends Record<string, unknown>>(
    _value: string,
    _valueList: string[],
): Eval<T, string> => (_tag: TagNode, _internals: Internals<T>): string => "";

const setList = <T extends Record<string, unknown>>(
    setter: (
        listStore: ListStore,
        key: string,
        values: string[],
    ) => Eval<T, string>,
    postprocess: (value: string, valueList: string[]) => Eval<T, string>,
) => (tag: TagNode, internals: Internals<T>) => (
    listStore: ListStore,
): string => {
    const [key, values] =
        tag.values.length === 2 ? tag.values : [["default"], tag.values[0]];

    const theKey = key[0];

    const valueList = listStore.getList(theKey);
    const value = setter(listStore, theKey, values)(tag, internals);

    return postprocess(value, valueList)(tag, internals as any);
};

const setListTemplate = <T extends Record<string, unknown>>(
    picker: (
        listStore: ListStore,
        key: string,
        values: string[],
    ) => Eval<T, string>,
) => ({
    tagname = "setl",
    storeId = "lists",
    postprocess = discard,
    optics = [separated({ sep: "::" }), mapped(), separated({ sep: "||" })],
} = {}) => (registrar: Registrar<T>) =>
    registrar.register(
        tagname,
        listStoreTemplate(storeId, setList(picker as any, postprocess) as any),
        { optics },
    );

const setListTo = (listStore: ListStore, key: string, values: string[]) => <
    T extends CardPreset
>(
    tag: TagNode,
    _internals: Internals<T>,
): string => {
    if (tag.num === null) {
        listStore.setList(key, values);
    } else {
        listStore.overwriteList(key, values, tag.num);
    }

    return "";
};

export const setListRecipe = setListTemplate(setListTo);
