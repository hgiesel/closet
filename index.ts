import renderTemplate from './src'
import FilterManager from './src/filterManager'
import filterRecipes from './src/filterManager/recipes'
import Stylizer from './src/filterManager/recipes/stylizer'

const closet = {
    renderTemplate: renderTemplate,
    FilterManager: FilterManager,
    filterRecipes: filterRecipes,
    Stylizer: Stylizer,
}

globalThis.closet = closet
