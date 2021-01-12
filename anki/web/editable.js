const elements = closet.template.anki.getQaChildNodes()
const memory = chooseMemory('closet__1')
const filterManager = closet.FilterManager.make(preset, memory.map)

const output = [[
    elements,
    memory,
    filterManager,
]]

/* here goes the setup - change it to fit your own needs */

$$setupCode
