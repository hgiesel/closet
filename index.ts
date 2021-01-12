export {
    version,
    versionInfo,
    prereleaseInfo
} from './src/version'

///////////////////////// Classes

export { Template } from './src/template'
export { BrowserTemplate } from './src/browser'

export { FilterManager } from './src'
export { Parser } from './src/template/parser'

export { Stylizer } from './src/recipes/stylizer'

export {
    TagSelector,
} from './src/tagSelector'

///////////////////////// closet.recipes, closet.wrappers, closet.deciders, closet.sequencers, closet.patterns

export {
    recipes,
    wrappers,
    deciders,
    sequencers,
    patterns,
} from './src/recipes'

///////////////////////// closet.browser

import {
    browser as recipesBrowser,
} from './src/recipes/browser'

import { cleanup } from './src/browser'

export const browser = {
    ...recipesBrowser,
    cleanup,
}

///////////////////////// closet.anki

export * as anki from './src/anki'

///////////////////////// closet.flashcard

import { FlashcardBehavior } from './src/recipes/flashcard/flashcardTemplate'

export const flashcard = {
    behavior: FlashcardBehavior,
}
