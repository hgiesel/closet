const inherit_id = 'closet__1'
const memoryMap = Closet.anki.memoryMap(inherit_id)
const filterManager = new Closet.FilterManager(memoryMap)

const elements = Closet.anki.getQaChildNodes()

filterManager.setPreset(preset)

/* here goes the setup - change it to fit your own needs */

filterManager.addRecipe(Closet.recipes.shuffling())
filterManager.addRecipe(Closet.recipes.ordering())

/* end of setup */

return [[
    elements,
    filterManager,
]]
