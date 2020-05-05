import { toString } from './closetExecutor/coerce'

import parseCode from './closetParser'
import execute from './closetExecutor'
import renderTemplate from './template'
import mkFilterManager from './template/filterManager'
import filterRecipes from './recipes'

globalThis.codeToString = toString

globalThis.parseCode = parseCode
globalThis.execute = execute
globalThis.renderTemplate = renderTemplate
globalThis.mkFilterManager = mkFilterManager
globalThis.filterRecipes = filterRecipes
