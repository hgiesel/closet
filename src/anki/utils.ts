export const ankiLog = (...objs: unknown[]): boolean => {
    const logDiv = Object.assign(document.createElement('div'), {
        'className': 'closet--log',
        'innerText': objs.map(String).join('\n'),
    })

    const qa = document.getElementById('qa')

    if (!qa) {
        return false
    }

    qa.appendChild(logDiv)
    return true
}
