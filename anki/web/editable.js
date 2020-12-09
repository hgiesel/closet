const elements = closet.anki.getQaChildNodes()
const memoryMap = chooseMemory('closet__1')
const memory = memoryMap.map

const filterManager = closet.FilterManager.make(preset, memory)

/* here goes the setup - change it to fit your own needs */

$$setupCode

/* end of setup */

const output = [[
    elements,
    memoryMap,
    filterManager,
]]
