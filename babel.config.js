module.exports = api => {
    api.cache(true)

    const presets = [
        [
            "@babel/preset-env", {
                "targets": {
                    "chrome": "57",
                    "browsers": "last 2 versions, ie 10-11"
                }
            }
        ],
    ]

    const plugins = [
        "@babel/plugin-proposal-class-properties"
    ]

    return {
        presets,
        plugins,
        "sourceMaps": true
    }
}
