export const appendStyleTag = (input: string): void => {
    var styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerHTML = input
    globalThis.document.head.appendChild(styleSheet)
}

const imageSrcPattern = /<img[^>]*?src="(.+?)"[^>]*>/g
export const getImages = (txt: string) => {
    const result = []
    let match: RegExpExecArray | null

    do {
        match = imageSrcPattern.exec(txt)
        if (match) {
            result.push(match[1])
        }
    } while (match)

    return result
}

export const getOffsets = (event: MouseEvent): [number, number] => {
    const boundingClientRect = (event.target as HTMLDivElement).getBoundingClientRect()

    const downX = event.offsetX /* Webkit */ || event.clientX - boundingClientRect.left /* Firefox */
    const downY = event.offsetY /* Webkit */ || event.clientY - boundingClientRect.top /* Firefox */

    return [downX, downY]
}
