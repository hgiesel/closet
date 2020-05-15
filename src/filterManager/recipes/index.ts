import mixRecipe from './mix'
import ordRecipe from './ord'
import clozeRecipe from './cloze'
import mcRecipe from './mc'
import randRecipe from './rand'

import debugRecipe from './debug'
import metaRecipe from './meta'

const recipes = {
    shuffling: mixRecipe,
    ordering: ordRecipe,
    cloze: clozeRecipe,
    random: randRecipe,
    multipleChoice: mcRecipe,
    debug: debugRecipe,
    meta: metaRecipe,
}

export default recipes
