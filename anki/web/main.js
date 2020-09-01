var side = '$$side'
var cardType = '$$cardType'
var tagsFull = '$$tagsFull'

var preset = closet.anki.preset(cardType, tagsFull, side)
var chooseMemory = closet.anki.persistenceInterface(side)

function userLogic() {
    $$userCode
}

var initCloset = () => {
    for (const [elements, memoryMap, filterManager] of userLogic()) {
        closet.BrowserTemplate
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
