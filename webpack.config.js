const path = require('path')
const Terser = require('terser-webpack-plugin')

module.exports = (env, argv) => {
    const destination = env && env.destination === 'docs'
        ? path.resolve(__dirname, 'docs', 'assets', 'js')
        : env && env.destination === 'anki'
        ? path.resolve(__dirname, 'anki', 'web')
        : path.resolve(__dirname, 'build')

    const filename = env && env.destination === 'docs' && argv.mode === 'production'
        ? 'main'
        : env && env.destination === 'docs'
        ? 'dev'
        : 'closet'

    return {
        mode: 'production',
        entry: './index.ts',
        target: 'web',

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
            ],
        },

        optimization: {
            minimize: argv.mode === 'production' ? true : false,
            minimizer: [
                new Terser({
                    terserOptions: {
                        mangle: true,
                        output: {
                            ecma: 6 /* default is 5 */,
                        },
                        ecma: 8, // specify one of: 5, 6, 7 or 8
                        ie8: false,
                        module: false,
                        nameCache: null, // or specify a name cache object
                        keep_classnames: true,
                        keep_fnames: true,
                        safari10: false,
                        toplevel: false,
                        warnings: false,
                    }
                }),
            ],
        },

        watch: argv.mode === 'production' ? false : true,

        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },

        experiments: {
            outputModule: true,
        },

        output: {
            library: 'closet',
            path: destination,
            filename: `${filename}.js`,
            iife: true,
        }
    }
};
