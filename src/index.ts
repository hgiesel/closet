import parseCode from './closetParser'
import execute from './closetExecutor'
import { toString } from './closetExecutor/coerce'

import parseTemplate from './templateParser'
import applyTemplate from './templateApplier'
import mkFilterManager from './templateApplier/filterManager'

globalThis.parseTemplate = parseTemplate
globalThis.parseCode = parseCode
globalThis.execute = execute
globalThis.codeToString = toString
globalThis.applyTemplate = applyTemplate
globalThis.mkFilterManager = mkFilterManager
