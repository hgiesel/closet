function userLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
}

import(globalThis.ankiPlatform === 'desktop' ? '/_closet.js' : './_closet.js')
    .then((closet) => {
        try {
            const time = closet.anki.init(closet, userLogic, '$$cardType', '$$tagsFull', '$$side')
            console.info(`Closet executed in ${time}ms.`)
        }
        catch (error) {
            console.error('An error occured while executing Closet:', error)
        }
        finally {
            closet.browser.cleanup()
        }
    })
    .catch((error) => console.error('An error occured while loading Closet:', error))
