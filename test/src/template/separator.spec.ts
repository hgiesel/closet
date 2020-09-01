import type { Separator } from '../../../src/template/separator'
import { splitValues } from '../../../src/template/separator'

describe('splitValues', () => {
    describe('basics', () => {
        test('should return string on zero separators', () => {
            const result = splitValues('Hello, world', [])
            expect(result).toBe('Hello, world')
        })

        test('should correctly split', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello, world', seps)
            const expected = ['Hello', ' world']

            expect(result).toStrictEqual(expected)
        })


        test('should trim the whitespace', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: Infinity,
                trim: true,
                keepEmpty: true,
            }]

            const result = splitValues(' Hello , world ', seps)
            const expected = ['Hello', 'world']

            expect(result).toStrictEqual(expected)
        })
    })

    describe('max', () => {
        test('should add the rest to last element, if it exceeds max', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: 2,
                trim: true,
                keepEmpty: true,
            }]

            const result = splitValues('This,is,a,test', seps)
            const expected = ['This', 'is,a,test']

            expect(result).toStrictEqual(expected)
        })
    })

    describe('keepEmpty', () => {
        test('should not change empty text if no separators', () => {
            const seps: Separator[] = []

            const result = splitValues('', seps)
            const expected = ''

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and keep trailing empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello::world::', seps)
            const expected = ['Hello', 'world', '']

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and discard trailing empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('Hello::world::', seps)
            const expected = ['Hello', 'world']

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and keep middle empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello::::world', seps)
            const expected = ['Hello', '', 'world']

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and discard middle empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('Hello::::world', seps)
            const expected = ['Hello', 'world']

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and keep leading empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('::Hello::world', seps)
            const expected = ['', 'Hello', 'world']

            expect(result).toStrictEqual(expected)
        })

        test('should respect keepEmpty and discard leading empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('::Hello::world', seps)
            const expected = ['Hello', 'world']

            expect(result).toStrictEqual(expected)
        })
    })

    describe('keepEmpty: multiple levels', () => {
        const emptyTrailing = 'Hello::world::'
        const emptyMiddle = 'Hello::::world'

        test('two keepEmpty: true, will preserve empty strings', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }, {
                sep: '||',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues(emptyTrailing, seps)
            const expected = [['Hello'],['world'], ['']]

            expect(result).toStrictEqual(expected)
        })

        test('outer keepEmpty: true, and inner keepEmpty: false allows specifying empty lists', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }, {
                sep: '||',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues(emptyTrailing, seps)
            const expected = [['Hello'], ['world'], []]

            expect(result).toStrictEqual(expected)
        })

        test('outer keepEmpty: true, and inner keepEmpty: false allows skipping lists', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }, {
                sep: '||',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues(emptyMiddle, seps)
            const expected = [['Hello'], [], ['world']]

            expect(result).toStrictEqual(expected)
        })
    })
})
