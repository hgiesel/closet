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

var closetLoaded = setInterval(() => {
  if (window.closet && window.Persistence) {
    clearInterval(closetLoaded)
    initCloset()
  }
}, 5)
