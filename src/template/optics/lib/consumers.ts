import type { ProfunctorDict } from "./profunctors.js"


export const run = (zooms, dict: ProfunctorDict, f) => {
    return zooms.reverse().reduce((accu, z) => z(dict, accu), f)
}
