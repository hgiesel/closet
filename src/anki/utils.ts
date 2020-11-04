export const ankiLog = (text: string): boolean => {
    const logDiv = Object.assign(document.createElement('div'), {
        'className': 'closet--log',
        'innerText': text,
    })

    const qa = document.getElementById('qa')

    if (!qa) {
        return false
    }

    qa.appendChild(logDiv)
    return true
}
