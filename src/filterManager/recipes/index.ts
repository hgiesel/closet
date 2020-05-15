import mixRecipe from './mix'
import ordRecipe from './ord'
import clozeRecipe from './cloze'
import mcRecipe from './mc'
import debugRecipe from './debug'
import randRecipe from './rand'

const recipes = {
    shuffling: mixRecipe,
    ordering: ordRecipe,
    cloze: clozeRecipe,
    random: randRecipe,
    multipleChoice: mcRecipe,
    debug: debugRecipe,
}

export default recipes
