var persistenceSwitch = Closet.anki.memorySwitch(globalThis.Persistence)
var preset = Closet.anki.preset('$$side')

function userLogic() {
$$userCode
}

var configurations = userLogic()

for (const [inherit_id, elements, filterManager] of configurations) {
    if (globalThis.Persistence && Persistence.isAvailable()) {
        persistenceSwitch.switchTo(inherit_id)
    }

    const bt = Closet.BrowserTemplate.makeFromNodes(elements)
    bt.renderToNodes(filterManager)
}
