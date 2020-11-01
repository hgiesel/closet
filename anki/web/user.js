const closetUserLogic = (
    closet,
    preset,
    chooseMemory,
) => {
    $$editableCode
}

const closetInit = (closet) => {
    try {
        const times = closet.anki.init(closet, closetUserLogic, '$$cardType', '$$tagsFull', '$$side')
        console.info(`Closet executed in ${times.map(t => t.toFixed(3))}ms.`)
    }
    catch (error) {
        console.error('An error occured while executing Closet:', error)
    }
    finally {
        closet.browser.cleanup()
    }
}

const closetInitialize = (closet) => {
    try {
        if (globalThis.closetAfterShown) {
            onShownHook.push(() => closetInit(closet))
        }
        else {
            closetInit(closet)
        }
    }
    catch {
        closetInit(closet)
    }
}

import(globalThis.ankiPlatform === 'desktop' ? '/__closet.js' : './__closet.js')
    .then(closetInitialize)
    .catch((error) => console.error('An error occured while loading Closet:', error))
