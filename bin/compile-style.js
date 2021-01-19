const fs = require('fs')
const path = require('path')
const sass = require('sass')

const __basedir = `${__dirname}/..`

const renderFile = (input, output) => {
    sass.render({
        file: input,
    }, (error, result) => {
        if (error) {
            console.error(error)
            return
        }

        fs.writeFile(output, result.css, (error) => {
            if(error) {
                return console.log(err)
            }

            console.log(`SCSS was successfully compiled to ${output}`)
        })
    })
}

renderFile(
    path.join(__basedir, 'style', 'editor.scss'),
    `${__basedir}/anki/web/editor.css`,
)

renderFile(
    path.join(__basedir, 'style', 'base.scss'),
    `${__basedir}/anki/web/closet.css`,
)
