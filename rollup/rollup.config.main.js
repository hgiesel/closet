/**
 * This is used for compiling closet down to a single file
 * This file can then be uploaded to the npm registry
 */
import typescript from '@rollup/plugin-typescript'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import { compilerOptions } from './rollup.config'

export default {
    input: 'index.ts',
    output: {
        file: `index.js`,
        format: 'cjs',
        name: 'Closet',
    },
    plugins: [
        typescript(compilerOptions),
        resolve(),
        commonjs(),
    ],
}
