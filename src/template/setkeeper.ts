interface SetInfo {
    start: number
    end: number
    innerSets: SetInfo[]
}

const mkSetInfo = (start: number) => ({
    start: start,
    end: 0,
    innerSets: [],
})

const mkSetKeeper = () => {
    const setInfos = []

    const getSetInfo = (idxs: number[]) => {
        let reference = setInfos

        for (const id of idxs) {
            reference = reference[id].innerSets
        }

        return reference
    }

    const setStack: number[] = []
    let nextLevel = 0

    const registerStart = (startIdx: number) => {
        getSetInfo(setStack).push(mkSetInfo(startIdx))

        setStack.push(nextLevel)
        nextLevel = 0
    }

    const registerEnd = (endIdx: number) => {
        const poppedLevel = setStack.pop()
        getSetInfo(setStack)[poppedLevel].end = endIdx
        nextLevel = poppedLevel + 1
    }

    return {
        registerStart: registerStart,
        registerEnd: registerEnd,
        returnSetInfos: () => setInfos,
    }
}
