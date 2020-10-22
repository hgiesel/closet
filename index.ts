export {
    version,
    versionInfo,
    prereleaseInfo
} from './src/version'

export { Template } from './src/template'
export { BrowserTemplate } from './src/browser'

export { FilterManager } from './src'
export { Parser } from './src/template/parser'
export { setDelimiters } from './src/template/utils'

export {
    keyPattern,
    keySeparationPattern,
    unicodeLetterPattern,
    unicodeNumberPattern,
    unicodeAlphanumericPattern,
} from './src/recipes/utils'

export { Stylizer } from './src/recipes/stylizer'

export {
    TagSelector,
} from './src/tagSelector'

export {
    recipes,
    wrappers,
    deciders,
    sequencers,
} from './src/recipes'

/////////////////////////

import {
    browser as recipesBrowser,
} from './src/recipes/browser'

import { cleanup } from './src/browser'

export const browser = {
    ...recipesBrowser,
    cleanup,
}

export * as anki from './src/anki'
