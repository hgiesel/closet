const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

const display = (htmlElement, obj, escape = true) => {
    if (escape) {
        htmlElement.innerHTML = escapeHtml(obj)
    }
    else {
        htmlElement.innerHTML = obj
    }
}

const btnExecute = document.getElementById('btn-execute')
const templateRendered = document.querySelector('#template-applied > .output')

const processTemplateText = () => {
    const filterManager = new FilterManager()
    filterManager.addRecipe(filterRecipes.shuffling('mix', ', '))
    filterManager.addRecipe(filterRecipes.debug)

    const text = codeCM.getValue().replace(/\n/g, '<br />')

    console.time('Render template')
    const result = renderTemplate(text, filterManager)
    console.timeEnd('Render template')

    display(templateRendered, result, escape=false)
}

btnExecute.addEventListener('click', processTemplateText)

///////////////////

const btnCopyLink = document.getElementById('btn-copy-link')
const copyTemplateTextAsLink = () => {
    const allText = codeCM.getValue()
    const link = (window.location.pathname + `?txt=${encodeURIComponent(allText)}`)

    navigator.clipboard.writeText(
        `${window.location.protocol}//${window.location.host}${link}`
    )
        .then(() => console.info('Successfully copied to clipboard'))
    window.location.replace(link)
}

btnCopyLink.addEventListener('click', copyTemplateTextAsLink)

///////////////////

const btnCopyText = document.getElementById('btn-copy-text')
const copyTemplateTextAsText = () => {
    const allText = codeCM.getValue()
    navigator.clipboard.writeText(allText)
}

btnCopyText.addEventListener('click', copyTemplateTextAsText)
