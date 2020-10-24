function userLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
}

import(globalThis.ankiPlatform === 'desktop' ? '/__closet.js' : './__closet.js')
    .then((closet) => {
        try {
            const times = closet.anki.init(closet, userLogic, '$$cardType', '$$tagsFull', '$$side')
            console.info(`Closet executed in ${times.map(t => t.toFixed(3))}ms.`)
        }
        catch (error) {
            console.error('An error occured while executing Closet:', error)
        }
        finally {
            closet.browser.cleanup()
        }
    })
    .catch((error) => console.error('An error occured while loading Closet:', error))
