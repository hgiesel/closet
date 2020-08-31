/**
 * This is used for compiling closet down to a file in /docs/assets/js/{main,dev}.js
 * `dev.js` will be used locally for testing the website
 * `main.js` will ultimately be used on the website, once pushed to GitHub-Pages
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
    compilerOptions
} from './rollup.config'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    input: 'index.ts',
    output: {
        file: `docs/assets/js/${production ? 'main' : 'dev'}.js`,
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Closet',
        sourcemap: !production,
    },
    plugins: [
        typescript(compilerOptions),
        resolve(),
        commonjs(),
        production && strip(stripOptions),
        production && terser(terserOptions),
    ],
}
