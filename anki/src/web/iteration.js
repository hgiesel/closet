var saveSwitch = Closet.anki.memorySwitch(globalThis.Persistence)
var inherit_id = 1

var qaChildren = Closet.browser.ChildNodeSpan(
    document.getElementById('qa'),
    { type: 'index', value: 1 },
    { type: 'predicate', value: v => v.id === 'anki-am' || v.tagName === 'SCRIPT', exclusive: true },
)

function userLogic() {
    var elements = [
        qaChildren
    ]

    var filterManager = new Closet.FilterManager(
        Closet.anki.preset,
        memorySwitch,
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
    memorySwitch.switch(inherit_id)
}
else {
    memorySwitch.fallback()
}

Closet.browser.renderTemplateFromNodes(elements, filterManager)
