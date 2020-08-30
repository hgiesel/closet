import { assert } from 'chai'
import 'mocha';

import type { Separator } from '../../../src/template/separator'

import { splitValues } from '../../../src/template/separator'


describe('splitValues', () => {
    describe('basics', () => {
        it('should return string on zero separators', () => {
            const result = splitValues('Hello, world', [])
            assert.strictEqual(result, 'Hello, world')
        })

        it('should correctly split', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello, world', seps)
            const expected = ['Hello', ' world']

            assert.deepEqual(result, expected)
        })

        it('should trim the whitespace', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: Infinity,
                trim: true,
                keepEmpty: true,
            }]

            const result = splitValues(' Hello , world ', seps)
            const expected = ['Hello', 'world']

            assert.deepEqual(result, expected)
        })
    })

    describe('max', () => {
        it('should add the rest to last element, if it exceeds max', () => {
            const seps: Separator[] = [{
                sep: ',',
                max: 2,
                trim: true,
                keepEmpty: true,
            }]

            const result = splitValues('This,is,a,test', seps)
            const expected = ['This', 'is,a,test']

            assert.deepEqual(result, expected)
        })
    })

    describe('keepEmpty', () => {
        it('should not change empty text if no separators', () => {
            const seps: Separator[] = []

            const result = splitValues('', seps)
            const expected = ''

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and keep trailing empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello::world::', seps)
            const expected = ['Hello', 'world', '']

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and discard trailing empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('Hello::world::', seps)
            const expected = ['Hello', 'world']

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and keep middle empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('Hello::::world', seps)
            const expected = ['Hello', '', 'world']

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and discard middle empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('Hello::::world', seps)
            const expected = ['Hello', 'world']

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and keep leading empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: true,
            }]

            const result = splitValues('::Hello::world', seps)
            const expected = ['', 'Hello', 'world']

            assert.deepEqual(result, expected)
        })

        it('should respect keepEmpty and discard leading empty element', () => {
            const seps: Separator[] = [{
                sep: '::',
                max: Infinity,
                trim: false,
                keepEmpty: false,
            }]

            const result = splitValues('::Hello::world', seps)
            const expected = ['Hello', 'world']

            assert.deepEqual(result, expected)
        })
    })

    describe('keepEmpty: multiple levels', () => {
        const emptyTrailing = 'Hello::world::'
        const emptyMiddle = 'Hello::::world'

        it('two keepEmpty: true, will preserve empty strings', () => {
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

            assert.deepEqual(result, expected)
        })

        it('outer keepEmpty: true, and inner keepEmpty: false allows specifying empty lists', () => {
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

            assert.deepEqual(result, expected)
        })

        it('outer keepEmpty: true, and inner keepEmpty: false allows skipping lists', () => {
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

            assert.deepEqual(result, expected)
        })
    })
})
