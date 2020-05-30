import typescript from '@rollup/plugin-typescript'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import {
    typescriptOptions,
} from './rollup.config.js'

export default {
    input: 'index.ts',
    output: {
        file: `index.js`,
        format: 'cjs',
        name: 'Closet',
    },
    plugins: [
        typescript(typescriptOptions),
        resolve(),
        commonjs(),
    ],
}