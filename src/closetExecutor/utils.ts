export const reshape = function*(arr: any[], columnSize: number) {
    let currIndex = 0
    while (arr.length >= currIndex + columnSize) {
        yield arr.slice(currIndex, currIndex + columnSize)
        currIndex += columnSize
    }
}
