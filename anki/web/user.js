const elements = Closet.anki.getQaChildNodes()

const inherit_id = 'closet__1'
const memoryMap = Closet.anki.memoryMap(inherit_id)

const filterManager = Closet.FilterManager.make(preset, memoryMap.map)

/* here goes the setup - change it to fit your own needs */

/* end of setup */

return [[
    elements,
    memoryMap,
    filterManager,
]]
