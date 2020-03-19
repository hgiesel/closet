# Test your code!

<script src="js/Main.js"></script>
<link rel="stylesheet" type="text/css" href="css/tester.css">

{% include tester.html %}

<script>
const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const display = (htmlElement, obj) => {
    try {
        htmlElement.innerHTML = escapeHtml(obj)
    }
    catch (e) {
        htmlElement.innerHTML = obj
    }

    htmlElement.style.display = 'block'
}


const templateParsed = document.getElementById('template-parsed')
const codeParsed = document.getElementById('code-parsed')
const codeExecuted = document.getElementById('code-executed')
const templateApplied = document.getElementById('template-applied')

const btn = document.getElementById('btn-execute')

btn.addEventListener('click', (_e) => {
    const templateTxt = document.getElementById('template').value
    const code = document.getElementById('code').value

    console.time('code parse')
    const codeOutput = parseCode(code)
    console.timeEnd('code parse')

    display(codeParsed, JSON.stringify(codeOutput, null, 4))

    try {
        console.time('code execute')
        const executed = execute(codeOutput, new Map())
        display(codeExecuted, codeToString(executed).value)
    }
    catch (e) {
        display(codeExecuted, e.toString())
        throw e
    }
    finally {
        console.timeEnd('code execute')
    }
})
</script>
