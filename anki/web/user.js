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

var closetIsReady = () => {
    return globalThis.hasOwnProperty('Persistence') &&
        globalThis.hasOwnProperty('closet') &&
        globalThis.closet.hasOwnProperty('anki') &&
        globalThis.closet.anki.hasOwnProperty('load')
}

var tryLoadCloset = (callback) => {
    if (closetIsReady()) {
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
