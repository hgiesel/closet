var tagsFull = '{{Tags}}'
var cardType = '{{Card}}'
var tags = tagsFull.split(' ')

var preset = {
    tagsFull: tagsFull,
    card: cardType,
    tags: tags,
}

var memorySwitch = (p) => {
    var path = null

    return {
        switch: (i) => {
            if (p.getItem(i)) {
                path = p.getItem(i)
            }
            else {
                p.setItem(i, new Map())
                path = p.getItem(i)
            }
        },
        fallback: () => {
            path = new Map()
        },
        has: (k) => path.has(k),
        get: (k) => path.get(k),
        set: (k, v) => path.set(k, v),
        delete: (k) => path.delete(k),
        clear: () => path.clear(),
    }
}

var inherit_id = 1

function userLogic() {
    var elements = document.querySelectorAll('#qa')
    var filterManager = new Closet.FilterManager(
        preset,
        memorySwitch,
    )

    $$userCode

    return [
        inherit_id,
        elements,
        filterManager,
    ]
}

var [
    inherit_id,
    elements,
    filterManager,
] = userLogic()

if (globalThis.Persistence && Persistence.isAvailable()) {
    memorySwitch.switch(inherit_id)
}
else {
    memorySwitch.fallback()
}

elements.innerHTML = renderTemplate(elements.innerHTML, filterManager)
