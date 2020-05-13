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

let run = 0
const templateErrorMessage = '<i>Run failed: There is a syntax error in the template text.</i>'
const presetErrorMessage = '<i>Error parsing preset JSON: Please fix syntax error or remove entirely</i>'
const presetMustBeObjectMessage = '<i>Error with preset JSON: preset must be an object</i>'

const processTemplateText = () => {
    presetCM.getWrapperElement().classList.remove('failed')
    codeCM.getWrapperElement().classList.remove('failed')

    /////////////////////////////

    const rawPresetText = presetCM.getValue().trim()
    let preset = null

    try {
        preset = rawPresetText.length > 0
            ? JSON.parse(rawPresetText)
            : {}
    }
    catch (e) {
        console.error(presetErrorMessage, e)
        presetCM.getWrapperElement().classList.add('failed')
        display(templateRendered, presetErrorMessage, escape=false)
        return
    }

    if (typeof preset !== 'object' || !preset) {
        console.error(presetMustBeObjectMessage)
        presetCM.getWrapperElement().classList.add('failed')
        display(templateRendered, presetMustBeObjectMessage, escape=false)
        return
    }

    /////////////////////////////

    const filterManager = new closet.FilterManager(preset)
    filterManager.addRecipe(closet.filterRecipes.shuffling('mix'))
    filterManager.addRecipe(closet.filterRecipes.ordering('ord', 'mix'))
    filterManager.addRecipe(closet.filterRecipes.debug)

    /////////////////////////////

    const text = codeCM.getValue().replace(/\n/g, '<br />')

    console.groupCollapsed(`Run ${run}`)
    console.time('Render template')

    let result = null
    try {
        result = closet.renderTemplate(text, filterManager)
    }
    catch (e) {
        console.error(templateErrorMessage, e)
        codeCM.getWrapperElement().classList.add('failed')
        display(templateRendered, templateErrorMessage, escape=false)
        return
    }
    finally {
        console.timeEnd('Render template')
        console.groupEnd(`Run ${run}`)
        run++
    }

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
