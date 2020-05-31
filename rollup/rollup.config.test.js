/**
 * This is used for compiling closet down to a file hierarchy in /dist
 * This is useful for the tests, which require js
 */
import typescript from '@rollup/plugin-typescript'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const typescriptOptions = {
    esModuleInterop: true,
    useDefineForClassFields: true,
    downlevelIteration: true,
    importHelpers: false,
    target: 'es5',
    module: 'esnext',
    lib: [
        'dom',
        'es2019',
    ],
}

export default {
    input: 'index.ts',
    output: {
        dir: 'test/browser/dist',
        format: 'es',
        name: 'Closet',
        exports: 'named',
    },
    preserveModules: true,
    plugins: [
        typescript(typescriptOptions),
        resolve(),
        commonjs(),
    ],
    external: [
        'tslib',
    ],
}
