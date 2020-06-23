const inherit_id = 1
const elements = Closet.anki.getQaChildNodes()
const filterManager = new FilterManager(Closet.anki.preset, persistenceSwitch)

/* here goes the setup - change it to fit your own needs */

filterManager.addRecipe(Closet.recipes.shuffling('mix'))
filterManager.addRecipe(Closet.recipes.ordering('ord', 'mix'))

/* end of setup */

return [[
    inherit_id,
    elements,
    filterManager,
]]
