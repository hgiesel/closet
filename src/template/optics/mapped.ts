import type { ProfunctorDict } from "./profunctors";
import type { Optic } from "./utils";

const fmap = <A, B>(f: (a: A) => B) => (xs: A[]): B[] => {
    return xs.map(f);
};

export const mapped = (): Optic => {
    return <A, B>(_dict: ProfunctorDict, f0: (a: A) => B) => {
        return fmap(f0);
    };
};
