const elements = closet.anki.getQaChildNodes()
const memoryMap = chooseMemory('closet__1')

const filterManager = closet.FilterManager.make(preset, memoryMap.map())

/* here goes the setup - change it to fit your own needs */

$$defaultCode

/* end of setup */

return [[
    elements,
    memoryMap,
    filterManager,
]]
