import { ProfunctorDict } from "./profunctors";

// to hard to type in TS
export type Optic = (
    dict: ProfunctorDict,
    f: (a: any) => any,
) => (x: any) => any;

export const escapeRegExp = (s: string): string => {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const regExpString = (re: string | RegExp): string => {
    return re instanceof RegExp ? re.source : re;
};
