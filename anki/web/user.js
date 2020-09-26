var side = '$$side'
var cardType = '$$cardType'
var tagsFull = '$$tagsFull'

var initCloset = () => {
    const preset = closet.anki.preset(cardType, tagsFull, side)
    const chooseMemory = closet.anki.persistenceInterface(side)

    function userLogic() {
        $$editableCode
    }

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

var tryLoadCloset = (callback) => {
    if (Object.hasOwnProperty.call(globalThis, 'closet') && Object.hasOwnProperty.call(globalThis, 'Persistence')) {
        closet.anki.load(callback)
        return true
    }
    return false
}

if (!tryLoadCloset(initCloset)) {
    var closetLoaded = setInterval(() => tryLoadCloset(()=> {
        initCloset()
        clearInterval(closetLoaded)
    }), 5)
}
