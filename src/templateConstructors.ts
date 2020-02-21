////////// CONSTRUCTORS FOR TEMPLATES

enum Element {
    Text,
    ValueSet,
}

const getSub = (valueSetName: string) => 0

const initialChars = /^[^0-9]+/u
const trailingNumbers = /[0-9]*$/u

const mkText = (text: string) => ({
    kind: Element.Text,
    value: text,
})

const mkValueSet = (values: string[]) => {
    const name: string = values[0].match(initialChars)[0]

    const idxString: string = values[0].match(trailingNumbers)[0]
    const idx: number = idxString.length === 0 ? null : Number(idxString)

    return {
        kind: Element.ValueSet,
        fullName: values[0],
        name: name,
        idx: idx,
        sub: getSub(values[0]),
        values: values.slice(1),
    }
}

export const mkElement = (values: string[]) => {
    return values.length === 1
        ? mkText(values[0])
        : mkValueSet(values)
}
