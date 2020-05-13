import renderTemplate from './main'
import FilterManager from './filterManager'
import filterRecipes from './filterManager/recipes'
import Stylizer from './filterManager/recipes/stylizer'

const closet = {
    renderTemplate: renderTemplate,
    FilterManager: FilterManager,
    filterRecipes: filterRecipes,
    Stylizer: Stylizer,
}

globalThis.closet = closet
