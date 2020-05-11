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
    input: 'src/index.ts',
    output: {
        file: `docs/assets/js/${production ? 'main' : 'dev'}.js`,
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Closet',
        sourcemap: !production,
    },
    plugins: [
        typescript(typescriptOptions),
        resolve(), // tells Rollup how to find stuff in node_modules
        commonjs(), // converts date-fns to ES modules
        production && strip(stripOptions),
        production && terser(terserOptions),
    ]
}
