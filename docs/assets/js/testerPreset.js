const codeTA = document.getElementById('code')
const codeCM = CodeMirror.fromTextArea(codeTA)

const sparams = new URLSearchParams(location.search)

if (sparams.has('txt')) {
    codeCM.setValue(sparams.get('txt'))
}
else if (codeCM.getValue.length === 0) {
    const defaultTxt =  'This is a [[hl::sample::text]].\nReplace it with whatever you [[em::w[[opt::ish||ant]]||desire]]!'
    codeCM.setValue(defaultTxt)
}
