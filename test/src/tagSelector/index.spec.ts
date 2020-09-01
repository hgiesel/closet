import { parseTagSelector } from '../../../src/tagSelector'

describe('parseTagSelector', () => {
    describe('catch-all patterns', () => {
        test('* matches everything', () => {
            const pred = parseTagSelector('*')

            expect(pred('c', 1, 5)).toBeTruthy()
            expect(pred('hello', null, 0)).toBeTruthy()
        })

        test('** matches everything', () => {
            const pred = parseTagSelector('**')

            expect(pred('c', 1, 5)).toBeTruthy()
            expect(pred('hello', null, 0)).toBeTruthy()
        })

        test('**:* matches everything', () => {
            const pred = parseTagSelector('**:*')

            expect(pred('c', 1, 5)).toBeTruthy()
            expect(pred('hello', null, 0)).toBeTruthy()
        })

        test('*{} matches any text, but no nums', () => {
            const pred = parseTagSelector('*{}')

            expect(pred('c', null, 5)).toBeTruthy()
            expect(pred('hello', null, 0)).toBeTruthy()
            expect(pred('cr', 1, 5)).toBeFalsy()
            expect(pred('hella', 2, 0)).toBeFalsy()
        })
    })
})
