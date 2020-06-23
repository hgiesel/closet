var persistenceSwitch = Closet.anki.memorySwitch(globalThis.Persistence)

function userLogic() {
$$userCode
}

var configurations = userLogic()

for (const [inherit_id, elements, filterManager] of configurations) {
    if (globalThis.Persistence && Persistence.isAvailable()) {
        persistenceSwitch.switchTo(inherit_id)
    }
    else {
        persistenceSwitch.fallback()
    }

    const bt = BrowserTemplate.make(elements)
    bt.renderNodes(filterManager)
}
