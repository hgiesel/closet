var side = '$$side'
var cardType = '$$cardType'
var tagsFull = '$$tagsFull'

var initCloset = () => {
    const preset = closet.anki.preset(cardType, tagsFull, side)
    const chooseMemory = closet.anki.persistenceInterface(side, document.getElementById('qa').innerHTML)

    function userLogic() {
        $$editableCode
    }

    for (const [elements, memoryMap, filterManager] of userLogic()) {
        closet.BrowserTemplate
            .makeFromNodes(elements)
            .renderToNodes(filterManager)

        memoryMap.writeBack()
    }
}

import('./_closet.js')
    .catch(error => console.error('An error happened while loading Closet', error))
    .then(() => closet.anki.load(initCloset))
    .then(time => console.info(`Closet executed in ${time}ms.`))
    .then(() => closet.browser.cleanup())
    .catch(error => console.error('An error happened while executing Closet', error))
