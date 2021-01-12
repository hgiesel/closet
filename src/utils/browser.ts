export const appendStyleTag = (input: string): void => {
    const styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerHTML = input
    document.head.appendChild(styleSheet)
}
