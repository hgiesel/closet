export type StoreGetter<T> = {
    get: (key: string, num: number | null | undefined, occur: number) => T;
};

export const constantGet = <T>(v: T): StoreGetter<T> => ({ get: () => v });

export { setNumberRecipe as setNumber } from "./numberStore";
export {
    activateRecipe as activate,
    deactivateRecipe as deactivate,
} from "./boolStore";
