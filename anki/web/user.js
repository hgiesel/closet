function closetUserLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
}

var closetPromise = import(globalThis.ankiPlatform === 'desktop' ? '/__closet.js' : './__closet.js')
    .then(
        closet => closet.anki.initialize(closet, closetUserLogic, '$$cardType', '$$tagsFull', '$$side'),
        error => console.log('An error occured while loading Closet:', error),
    ).catch(error => console.log('An error occured while executing Closet:', error))

