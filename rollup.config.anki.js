import {
    terser,
} from 'rollup-plugin-terser'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import strip from '@rollup/plugin-strip'

import {
    terserOptions,
    typescriptOptions,
    stripOptions,
} from './rollup.config.js'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    input: 'index.ts',
    output: {
        file: 'anki/src/web/closet.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Closet',
        sourcemap: false,
    },
    plugins: [
        typescript(typescriptOptions),
        resolve(),
        commonjs(),
        production && strip(stripOptions),
        production && terser(terserOptions),
    ],
}
