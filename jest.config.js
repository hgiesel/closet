const { defaults } = require('jest-config')

module.exports = {
    roots: [
        '<rootDir>',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: 'test/.*\\.spec\\.tsx?$',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    verbose: true,

    modulePaths: [
        '<rootDir>/node_modules',
    ],
}
