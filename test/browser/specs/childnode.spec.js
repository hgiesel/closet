import { ChildNodeSpan } from '../dist/src/browserUtils.js'

const assert = chai.assert

describe('ChildNodeSpan', () => {
    before(() => {
        const parent = document.querySelector('#childnodetest > .first')
        assert.equal(parent.childNodes.length, 9, 'parent has wrong childNodes')
    })

    it('can be set via index arg', () => {
        const parent = document.querySelector('#childnodetest > .first')
        console.log(parent)
        const test = new ChildNodeSpan(parent, {
            type: 'index',
            value: 0,
        }, {
            type: 'index',
            value: 3,
        })

        assert.equal(test.from, 0, 'to is not set correctly')
        assert.equal(test.to, 3, 'from is not set correctly')
    })
})
