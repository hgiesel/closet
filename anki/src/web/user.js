const inherit_id = 1
const elements = Closet.anki.getQaChildNodes()
const filterManager = new Closet.FilterManager(persistenceSwitch)
filterManager.setPreset(preset)

/* here goes the setup - change it to fit your own needs */

filterManager.addRecipe(Closet.recipes.shuffling())
filterManager.addRecipe(Closet.recipes.ordering())

/* end of setup */

return [[
    inherit_id,
    elements,
    filterManager,
]]
