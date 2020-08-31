import { assert } from 'chai'
import 'mocha';

import { parseTagSelector } from '../../../src/tagSelector'

describe('parseTagSelector', () => {
    describe('basics', () => {
        it('single star matches everything', () => {
            const pred = parseTagSelector('*')
            assert.isTrue(pred('c', 1, 5))
            assert.isTrue(pred('hello', null, 0))
        })
    })
})
