var side = '$$side'
var cardType = '$$cardType'
var tagsFull = '$$tagsFull'

var preset = Closet.anki.preset(cardType, tagsFull, side)
var chooseMemory = Closet.anki.persistenceInterface(side)

function userLogic() {
    $$userCode
}

var initCloset = () => {
    for (const [elements, memoryMap, filterManager] of userLogic()) {
        Closet.BrowserTemplate
            .makeFromNodes(elements)
            .renderToNodes(filterManager)

        memoryMap.writeBack()
    }
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)) {
    initCloset()
}
else {
    document.addEventListener('DOMContentLoaded', initCloset)
}
