import { wrap, wrapWithDeferred, wrapWithAftermath } from './wrappers'
import { sum, sumFour } from './sum'
import { product } from './product'
import { collection } from './collection'

export const wrappers = {
    wrap,

    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,

    sum,
    sumFour,

    product,
    collection,
}
