import {
    setListRecipe,
} from './setList'

import {
    pickRandomRecipe,
    pickIndexRecipe,
    pickCardNumberRecipe,
} from './pickers'


const sharedStore = {
    setList: setListRecipe,
    pick: pickRandomRecipe,
    pickIndex: pickIndexRecipe,
    pickCardNumber: pickCardNumberRecipe,
}

export default sharedStore
