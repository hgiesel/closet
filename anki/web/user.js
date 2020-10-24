import * as closet from './__closet.js'

function userLogic(
    closet,
    preset,
    chooseMemory,
) {
    $$editableCode
}

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
