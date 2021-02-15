import type { ProfunctorDict } from "./profunctors.js"

const fmap = <A,B>(f: (a: A) => B) => (xs: A[]): B[] => {
    return xs.map(f)
}

export const mapped = () => {
    return <A,B>(_dict: ProfunctorDict, f0: (a: A) => B) => {
        return fmap(f0)
    }
}

