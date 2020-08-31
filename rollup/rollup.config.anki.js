/**
 * This is used for compiling closet down to a file in /anki/src/web/closet.js
 * This file will be included in Card templates
 */
import {
    terser,
} from 'rollup-plugin-terser'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import strip from '@rollup/plugin-strip'

import {
    terserOptions,
    stripOptions,
} from './rollup.config.js'

import * as tsconfig from '../tsconfig.json'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    input: 'index.ts',
    output: {
        file: 'anki/web/closet.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Closet',
        sourcemap: false,
    },
    plugins: [
        typescript(tsconfig),
        resolve(),
        commonjs(),
        production && strip(stripOptions),
        production && terser(terserOptions),
    ],
}
