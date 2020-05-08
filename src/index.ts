import renderTemplate from './parser'
import mkFilterManager from './filterManager'

globalThis.renderTemplate = renderTemplate
globalThis.mkFilterManager = mkFilterManager

import filterRecipes from './recipes'

globalThis.filterRecipes = filterRecipes
