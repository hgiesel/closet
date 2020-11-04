export const ankiLog = (text: string): void => {
    document.getElementById('qa')?.appendChild(document.createTextNode(text))
}
