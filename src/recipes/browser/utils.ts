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
