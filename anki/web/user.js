const elements = Closet.anki.getQaChildNodes()
const memoryMap = chooseMemory('closet__1')

const filterManager = Closet.FilterManager.make(preset, memoryMap.map())

/* here goes the setup - change it to fit your own needs */

$$defaultCode

/* end of setup */

return [[
    elements,
    memoryMap,
    filterManager,
]]
