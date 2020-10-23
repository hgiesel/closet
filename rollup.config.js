import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { terser } from "rollup-plugin-terser"

const terserOptions = {
    output: {
        comments: false,
    },

    compress: {
        drop_console: true,
    },
}

const babelOptions = {
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
}

/**
 * available configs:
 *  (none)
 *  --configAnki
 *  --configWeb
 *  --configWebDev
 */

export default args => {
    const file = args.configAnki
        ? 'anki/web/closet.js'
        : 'build/closet.js'

    return {
        input: 'index.ts',
        output: {
            file,
            format: 'esm'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            babel(babelOptions),
            terser(terserOptions),
        ],
    }
}
