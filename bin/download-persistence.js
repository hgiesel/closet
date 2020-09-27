const https = require('https')
const fs = require('fs')

const sourceURL = 'https://raw.githubusercontent.com/SimonLammer/anki-persistence/master/script.js'

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const filePath = '../anki/web/persistence.js'
const file = fs.createWriteStream(filePath)

https.get(sourceURL, (res) => {
    res.pipe(file)
}).on('error', (_err) => {
    process.stdout.write('Anki Persistence does not seem to be available anymore')
})
