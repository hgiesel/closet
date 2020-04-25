export interface Set {
    fullName: string,
    name: string,
    idx: number | null,
    sub: number,
    values: string[][],
}

const getSub = (valueSetName: string) => 0

const initialChars = /^[^0-9]+/u
const trailingNumbers = /[0-9]*$/u

export const mkSet = (head: string, values: string[][]): Set => {
    console.log(head, values)
    const name: string = head.match(initialChars)[0]

    const idxString: string = head.match(trailingNumbers)[0]
    const idx: number = idxString.length === 0 ? null : Number(idxString)

    return {
        fullName: head,
        name: name,
        idx: idx,
        sub: getSub(head),
        values: values.slice(1),
    }
}

export interface SetInfo {
    start: number
    end: number
    theSet: Set,
    innerSets: SetInfo[]
}

export const mkSetInfo = (start: number) => ({
    start: start,
    end: 0,
    theSet: null,
    innerSets: [],
})
