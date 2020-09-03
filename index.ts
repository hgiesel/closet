export {
    version,
    versionInfo,
    prereleaseInfo
} from './src/version'

export { Template } from './src/template'
export { BrowserTemplate } from './src/browserTemplate'

export { FilterManager } from './src'
export { Parser } from './src/template/parser'

export {
    keyPattern,
    keySeparationPattern,
    unicodeLetterPattern,
    unicodeNumberPattern,
    unicodeAlphanumericPattern,
} from './src/recipes/utils'

export { Stylizer } from './src/recipes/stylizer'

export {
    parseTagSelector
} from './src/tagSelector'

export {
    recipes,
    wrappers,
    deciders,
    sequencers,
} from './src/recipes'

export {
    browser,
} from './src/recipes/browser'

export * as anki from './src/ankiUtils'
