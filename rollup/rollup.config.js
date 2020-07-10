export const terserOptions = {
    mangle: true,
    output: {
        ecma: 6 /* default is 5 */,
    },
    ecma: 8, // specify one of: 5, 6, 7 or 8
    ie8: false,
    module: false,
    nameCache: null, // or specify a name cache object
    safari10: false,
    toplevel: false,
    warnings: false,
}

export const stripOptions = {
    debugger: true,
    // functions: ['console.*', 'assert.*'],
    labels: [],
    sourceMap: true,
    include: '**/*.ts',
}

export const typescriptOptions = {
    // strict: true,
    noImplicitAny: true,
    noImplicitThis: true,
    // strictNullChecks: true,
    alwaysStrict: true,

    downlevelIteration: true,
    target: 'es5',
    lib: [
        'dom',
        'es2019',
    ],
}
