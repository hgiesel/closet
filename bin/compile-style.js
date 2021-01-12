const sass = require('sass')
const fs = require('fs')

sass.render({
    file: '../style/index.scss',
}, (error, result) => {
    if (error) {
        console.error(error)
        return
    }

    console.log(result)

    fs.writeFile("../anki/web/closet.css", result.css, (error) => {
        if(error) {
            return console.log(err)
        }

        console.log("SCSS was successfully compiled")
    })
})
