import { parseTagSelector } from '../../../src/tagSelector'

describe('parseTagSelector', () => {
    describe('basics', () => {
        test('single star matches everything', () => {
            // jest.mock('moo')
            // console.log('hello there', moo)

            const pred = parseTagSelector('*')
            expect(pred('c', 1, 5)).toBeTruthy()
            // expect(pred('hello', null, 0)).toBeTruthy()
        })
    })
})
