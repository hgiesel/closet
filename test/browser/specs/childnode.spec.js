import { ChildNodeSpan } from '../dist/src/browserUtils.js'

const assert = chai.assert

describe('ChildNodeSpan', () => {
    it('returns 0', () => {
        const parent = document.querySelector('#childnodetest > .first')
        const test = ChildNodeSpan(parent, {
            type: 'index',
            value: 0,
        }, {
            type: 'index',
            value: 3,
        })

        console.log(test)
    })
})
