import { wrap, wrapWithDeferred, wrapWithAftermath } from './wrappers'
import { sum, sumFour } from './sum'
import { product } from './product'
import { collection } from './collection'

const wrappers = {
    wrap,

    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,

    sum,
    sumFour,

    product,
    collection,
}

export default wrappers
