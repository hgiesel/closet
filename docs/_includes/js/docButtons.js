const readyRenderButton = (
    buttonQuery,
    displayQuery,
    code,
    preset,
    keepMemory,
    filterManager,
) => {
    const theDisplay = document.querySelector(displayQuery)
    const btnRerender = document.querySelector(buttonQuery)

    if (!filterManager) {
        filterManager = new Closet.FilterManager(preset)
    }

    btnRerender.addEventListener('click', () => {
        theDisplay.innerHTML = Closet.renderTemplate(code, filterManager)

        if (!keepMemory) {
            filterManager.clearMemory()
        }
    })

    btnRerender.dispatchEvent(new Event('click'))
}

const readyFmButton = (buttonQuery, displayQuery, fmCode) => {
    const fmButton = document.querySelector(buttonQuery)
    const fmDisplay = document.querySelector(displayQuery)

    fmButton.addEventListener('mouseenter', () => {
        fmDisplay.style.display = 'block'
    })

    fmButton.addEventListener('mouseleave', () => {
        fmDisplay.style.display = 'none'
    })

    fmButton.addEventListener('click', () => {
        navigator.clipboard.writeText(fmCode)
    })
}

const readyTryButton = (buttonQuery, code, preset) => {
    const btnEdit = document.querySelector(buttonQuery)

    btnEdit.addEventListener('click', () => {
        const link = `/closet/tester?text=${encodeURIComponent(code.replace(/<br \/>/g, '\n'))}&preset=${encodeURIComponent(preset)}`

        window.location = link
    })
}
