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
    // layerX / layerY are deprecated, however offsetX/Y gives wrong values work on Firefox
    const downX = (event as any).layerX || event.offsetX
    const downY = (event as any).layerY || event.offsetY

    return [downX, downY]
}

export const imageLoadCallback = (query: string, callback: (event: Event) => void) => {
    const maybeElement = document.querySelector(query) as HTMLImageElement

    if (maybeElement) {
        maybeElement.addEventListener('load', callback)
    }
}
