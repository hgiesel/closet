// import commonjs from 'rollup-plugin-commonjs';

export const terserOptions = {
  parse: {
    // parse options
  },
  compress: {
    // compress options
  },
  mangle: true,
  output: {
    ecma: 6 /* default is 5 */,
  },
  sourcemap: {
    // source map options
  },
  ecma: 8, // specify one of: 5, 6, 7 or 8
  ie8: false,
  module: false,
  nameCache: null, // or specify a name cache object
  safari10: false,
  toplevel: false,
  warnings: false,
}
