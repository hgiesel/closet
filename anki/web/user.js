var side = '$$side'
var cardType = '$$cardType'
var tagsFull = '$$tagsFull'

var preset = closet.anki.preset(cardType, tagsFull, side)
var chooseMemory = closet.anki.persistenceInterface(side)

function userLogic() {
    $$editableCode
}

var initCloset = () => {
    const before = window.performance.now()

    for (const [elements, memoryMap, filterManager] of userLogic()) {
        closet.BrowserTemplate
            .makeFromNodes(elements)
            .renderToNodes(filterManager)

        memoryMap.writeBack()
    }

    const after = window.performance.now()
    window.closetRenderTime = after - before
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState)) {
    initCloset()
}
else {
    document.addEventListener('DOMContentLoaded', initCloset)
}
