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
        drop_console: false,
        pure_funcs: [],
    },
}

const tsconfigDist = {
    declaration: true,
    declarationDir: "dist/",
}

/**
 * available configs:
 *  --configDocs
 *  --configAnki
 *  --configDist
 *  --configDistWeb
 *  --configDev
 */
export default args => {
    const destination = args.configAnki
        ? { file: 'anki/web/closet.js' }
        : args.configDocs
        ? { file: 'docs/assets/js/closet.js' }
        : args.configDist
        ? { dir: 'dist/' }
        /* args.configDistWeb */
        : { file: 'dist/closet.min.js' }


    const format = args.configAnki
        ? 'esm'
        : args.configDocs || args.configDistWeb
        ? 'iife'
        /* args.configDist */
        : 'cjs'

    const plugins = [
        nodeResolve(),
        commonjs(),
        typescript(args.configDist
            ? tsconfigDist
            : {}
        ),
        babel(babelOptions),
    ]

    if (!args.configDev) {
        plugins.push(terser(terserOptions))
    }

    return {
        input: 'index.ts',
        output: {
            name: 'closet',
            ...destination,
            format,
            sourcemap: args.configDistWeb,
        },
        plugins,
    }
}
