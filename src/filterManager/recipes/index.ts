import mixRecipe from './mix'
import ordRecipe from './ord'
import clozeRecipe from './cloze'
import mcRecipe from './mc'
import debugRecipe from './debug'

const recipes = {
    shuffling: mixRecipe,
    ordering: ordRecipe,
    cloze: clozeRecipe,
    multipleChoice: mcRecipe,
    debug: debugRecipe,
}

export default recipes
