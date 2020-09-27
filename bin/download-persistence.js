const https = require('https')
const terser = require('terser')
const fs = require('fs')

const sourceURL = 'https://raw.githubusercontent.com/SimonLammer/anki-persistence/master/script.js'

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const filePath = '../anki/web/persistence.js'

const writeToFile = (code) => {
    fs.writeFile(filePath, code, () => {
        process.stdout.write(`Anki Persistence was successfully written to "${filePath}"`)
    })
}

https.get(sourceURL, (res) => {
    let data = ''

    res.on('data', (chunk) => {
        data += ab2str(chunk)
    })

    res.on('end', () => {
        terser.minify(data)
            .then((minified) => minified.code)
            .then(writeToFile)
            .catch(process.stderr.write)
    })
}).on('error', (_err) => {
    process.stdout.write('Anki Persistence does not seem to be available anymore')
})
