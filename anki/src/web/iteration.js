var persistenceSwitch = Closet.anki.memorySwitch(globalThis.Persistence)
var inherit_id = 1

var qaChildren = new Closet.browser.ChildNodeSpan(
    document.getElementById('qa'),
    { type: 'index', value: 1 },
    { type: 'predicate', value: v => v.id === 'anki-am' || v.tagName === 'SCRIPT', exclusive: true },
)

function userLogic() {
    var elements = []
    var filterManager = new Closet.FilterManager(
        Closet.anki.preset,
        persistenceSwitch,
    )

$$userCode

    return [
        inherit_id,
        elements,
        filterManager,
    ]
}

var [inherit_id, elements, filterManager] = userLogic()

if (globalThis.Persistence && Persistence.isAvailable()) {
    persistenceSwitch.switchTo(inherit_id)
}
else {
    persistenceSwitch.fallback()
}

Closet.browser.renderTemplateFromNodes(elements, filterManager)