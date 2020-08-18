var preset = Closet.anki.preset('$$cardType', '$$tagsFull', '$$side')

function userLogic() {
$$userCode
}

onShownHook.push((a, b) => {
    console.log('test', a, b)

    for (const [elements, memoryMap, filterManager] of userLogic()) {
        Closet.BrowserTemplate
            .makeFromNodes(elements)
            .renderToNodes(filterManager)

        memoryMap.writeBack()
    }
})
