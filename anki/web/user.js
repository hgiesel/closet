function closetUserLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
}

import(globalThis.ankiPlatform === 'desktop' ? '/__closet.js' : './__closet.js')
    .then(closet => closet.anki.initialize(closet, closetUserLogic, '$$cardType', '$$tagsFull', '$$side'))
    .catch(error => console.error('An error occured while loading Closet:', error))
