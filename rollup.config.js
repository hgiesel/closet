import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { terser } from "rollup-plugin-terser"

const babelOptions = {
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
}

const terserOptions = {
    output: {
        comments: false,
    },

    compress: {
        drop_console: true,
    },
}

/**
 * available configs:
 *  (none)
 *  --configAnki
 *  --configWeb
 *  --configDev
 */

export default args => {
    const file = args.configAnki
        ? 'anki/web/closet.js'
        : 'build/closet.js'

    const plugins = [
        nodeResolve(),
        commonjs(),
        typescript(),
        babel(babelOptions),
    ]

    if (!args.configDev) {
        plugins.push(terser(terserOptions))
    }

    return {
        input: 'index.ts',
        output: {
            file,
            format: 'esm'
        },
        plugins,
    }
}
