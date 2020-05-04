import {
    Slang,
    SlangType,
} from '../types'


const shcutParam = /^%([1-9][0-9]*)?$/u

export const shcutFuncArity = (v: Slang, currentMax: number = 0): number => {
    switch (v.kind) {
        case SlangType.Symbol:
            const m = v.value.match(shcutParam)

            if (m) {
                if (!m[1]) {
                    return Math.max(currentMax, 1)
                }

                return Math.max(currentMax, Number(m[1]))
            }

            return currentMax

        case SlangType.List:
            const headMax = shcutFuncArity(v.head, currentMax)
            const tailMaxes = v.tail.map(t => shcutFuncArity(t, headMax))

            return Math.max(...tailMaxes)

        case SlangType.Vector:
            const vmaxes = v.members.map(m => shcutFuncArity(m, currentMax))

            return Math.max(...vmaxes)

        case SlangType.Map:
            const mmaxes = []

            v.table.forEach((v) => {
                mmaxes.push(shcutFuncArity(v, currentMax))
            })

            return Math.max(...mmaxes)

        case SlangType.Do:
            const dmaxes = v.expressions.map(e => shcutFuncArity(e, currentMax))
            return Math.max(...dmaxes)

        case SlangType.If:
            return Math.max(
                shcutFuncArity(v.condition, currentMax),
                shcutFuncArity(v.thenClause, currentMax),
                shcutFuncArity(v.elseClause, currentMax),
            )

        case SlangType.Let:
            const lmax = shcutFuncArity(v.body, currentMax)
            const lmaxes = []

            v.bindings.forEach((v) => {
                mmaxes.push(shcutFuncArity(v, lmax))
            })

            return Math.max(...lmaxes)


        case SlangType.Def:
            return shcutFuncArity(v.value, currentMax)

        case SlangType.Case:
            const cmax = shcutFuncArity(v.variable)

            return Math.max(...v.tests.map(pair => Math.max(
                shcutFuncArity(pair[0], cmax),
                shcutFuncArity(pair[1], cmax),
            )))

        case SlangType.Cond:
            return Math.max(...v.tests.map(pair => Math.max(
                shcutFuncArity(pair[0], currentMax),
                shcutFuncArity(pair[1], currentMax),
            )))

        default:
            return currentMax
    }
}
