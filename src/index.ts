import parseTemplate from './templateParser'
import parseCode from './closetParser'
import execute from './closetExecutor'
import { toString } from './closetExecutor/coerce'
import applyTemplate from './templateApplier'

globalThis.parseTemplate = parseTemplate
globalThis.parseCode = parseCode
globalThis.execute = execute
globalThis.codeToString = toString
globalThis.applyTemplate = applyTemplate
