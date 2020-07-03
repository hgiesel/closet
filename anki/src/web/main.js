var preset = Closet.anki.preset('$$cardType', '$$tagsFull', '$$side')

function userLogic() {
$$userCode
}

var configurations = userLogic()

for (const [elements, memoryMap, filterManager] of configurations) {
    const bt = Closet.BrowserTemplate.makeFromNodes(elements)
    bt.renderToNodes(filterManager)
    memoryMap.writeBack()
}
