import {
    terser,
} from 'rollup-plugin-terser'

import {
    terserOptions,
    typescriptOptions,
    stripOptions,
} from './rollup.config.js'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import strip from '@rollup/plugin-strip'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    input: 'src/index.ts',
    output: {
        file: 'docs/assets/js/Main.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Closet',
        sourcemap: true,
    },
    plugins: [
        typescript(typescriptOptions),
        resolve(), // tells Rollup how to find stuff in node_modules
        commonjs(), // converts date-fns to ES modules
        production && strip(stripOptions),
        production && terser(terserOptions),
    ]
}
