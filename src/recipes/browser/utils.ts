export const appendStyleTag = (input: string): void => {
    var styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerHTML = input
    globalThis.document.head.appendChild(styleSheet)
}
