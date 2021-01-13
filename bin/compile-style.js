const fs = require('fs')
const path = require('path')
const sass = require('sass')

const __basedir = `${__dirname}/..`

const inputFile = path.join(__basedir, 'style', 'index.scss')
const outputFile = `${__basedir}/anki/web/closet.css`


sass.render({
    file: inputFile,
}, (error, result) => {
    if (error) {
        console.error(error)
        return
    }

    fs.writeFile(outputFile, result.css, (error) => {
        if(error) {
            return console.log(err)
        }

        console.log(`SCSS was successfully compiled to ${outputFile}`)
    })
})
