import { ChildNodeSpan, interspliceChildNodes } from '../dist/src/browserUtils.js'

const assert = chai.assert

describe('interspliceChildNodes', () => {
    before(() => {
        const parent = document.querySelector('#childnodetest > .first')
        assert.strictEqual(parent.childNodes.length, 9, 'parent has wrong childNodes')
    })

    it('defaults to the whole span', () => {
    })
})
