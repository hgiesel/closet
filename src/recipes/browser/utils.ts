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
        if (maybeElement.complete) {
            callback({ target: maybeElement } as any)
        }

        else {
            maybeElement.addEventListener('load', callback)
        }
    }
}

export const getCurrentIndex = (labels: string[]) => {
    let result = 0

    for (const label of labels) {
        label.match
    }
}

export const svgKeyword = 'occlusionSvgCss'
export const svgCss = `
img {
  max-width: 100% !important;
}

.closet__occlusion-container {
  display: inline-block;
  position: relative;
}

.closet__occlusion-container > * {
  display: block;

  margin-left: auto;
  margin-right: auto;
}

.closet__occlusion-container > svg {
  position: absolute;
  top: 0;
}

.closet__occlusion-shape > text {
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}`
