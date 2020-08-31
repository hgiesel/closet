const path = require('path')
const Terser = require('terser-webpack-plugin')

module.exports = (env, argv) => {
    const destination = env.destination === 'docs'
        ? path.resolve(__dirname, 'docs', 'assets', 'js')
        : env.destination === 'anki'
        ? path.resolve(__dirname, 'anki', 'web')
        : path.resolve(__dirname, 'dist')

    const filename = env.destination === 'docs' && argv.mode === 'production'
        ? 'main'
        : env.destination === 'docs'
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
                new Terser(),
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
