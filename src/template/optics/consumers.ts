import type { ProfunctorDict } from "./profunctors";

export const run = <A, B>(zooms: any, dict: ProfunctorDict, f: (a: A) => B) => {
    return zooms.reverse().reduce((accu: any, z: any) => z(dict, accu), f);
};
