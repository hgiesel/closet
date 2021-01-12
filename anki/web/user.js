function closetUserLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
    return output
}

var getAnkiPrefix = () => globalThis.ankiPlatform === 'desktop'
    ? ''
    : globalThis.AnkiDroidJS
    ? 'https://appassets.androidplatform.net'
    : '.'

var closetPromise = import(`${getAnkiPrefix()}/__closet-$$version.js`)
    .then(
        closet => closet.template.anki.initialize(closet, closetUserLogic, '$$cardType', '$$tagsFull', '$$side'),
        error => console.log('An error occured while loading Closet:', error),
    ).catch(error => console.log('An error occured while executing Closet:', error))

if (globalThis.onUpdateHook) {
    onUpdateHook.push(() => closetPromise)
}
