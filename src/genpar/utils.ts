import {
    Slang,
    SlangTypes,
} from '../types'


const shcutParam = /^%([1-9][0-9]*)?$/u

export const shcutFuncArity = (v: Slang, currentMax: number = 0): number => {
    switch (v.kind) {
        case SlangTypes.Symbol:
            const m = v.value.match(shcutParam)

            if (m) {
                if (!m[1]) {
                    return Math.max(currentMax, 1)
                }

                return Math.max(currentMax, Number(m[1]))
            }

            return currentMax

        case SlangTypes.List:
            const headMax = shcutFuncArity(v.head, currentMax)
            const tailMaxes = v.tail.map(t => shcutFuncArity(t, headMax))

            return Math.max(...tailMaxes)

        case SlangTypes.Vector:
            const vmaxes = v.members.map(m => shcutFuncArity(m, currentMax))

            return Math.max(...vmaxes)

        case SlangTypes.Map:
            const mmaxes = []

            v.table.forEach((v) => {
                mmaxes.push(shcutFuncArity(v, currentMax))
            })

            return Math.max(...mmaxes)

        case SlangTypes.Do:
            const dmaxes = v.expressions.map(e => shcutFuncArity(e, currentMax))
            return Math.max(...dmaxes)

        case SlangTypes.If:
            return Math.max(
                shcutFuncArity(v.condition, currentMax),
                shcutFuncArity(v.thenClause, currentMax),
                shcutFuncArity(v.elseClause, currentMax),
            )

        case SlangTypes.Let:
            const lmax = shcutFuncArity(v.body, currentMax)
            const lmaxes = []

            v.bindings.forEach((v) => {
                mmaxes.push(shcutFuncArity(v, lmax))
            })

            return Math.max(...lmaxes)


        case SlangTypes.Def:
            return shcutFuncArity(v.value, currentMax)

        case SlangTypes.Case:
            const cmax = shcutFuncArity(v.variable)

            return Math.max(...v.tests.map(pair => Math.max(
                shcutFuncArity(pair[0], cmax),
                shcutFuncArity(pair[1], cmax),
            )))

        case SlangTypes.Cond:
            return Math.max(...v.tests.map(pair => Math.max(
                shcutFuncArity(pair[0], currentMax),
                shcutFuncArity(pair[1], currentMax),
            )))

        default:
            return currentMax
    }
}
