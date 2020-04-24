import parseTemplate from './template'
import parseCode from './closet'
import execute from './executor'
import { toString } from './executor/coerce'

globalThis.parseTemplate = parseTemplate
globalThis.parseCode = parseCode
globalThis.execute = execute
globalThis.codeToString = toString
