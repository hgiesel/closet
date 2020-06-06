const allButtons = new Map()
const currentPreset = new Map()

const readyRenderButton = (
    id,
    btnId,
    code,
    preset,
    keepMemory,
    filterManager,
) => {
    const buttonQuery = `${id} .btn-${btnId}`
    const displayQuery = `${id} > .display`

    const theDisplay = document.querySelector(displayQuery)
    const btnRerender = document.querySelector(buttonQuery)

    if (!filterManager) {
        filterManager = new Closet.FilterManager(preset)
    }

    if (allButtons.has(id)) {
        allButtons.get(id).push(btnRerender)
    }
    else {
        allButtons.set(id, [btnRerender])
    }

    btnRerender.addEventListener('click', () => {
        theDisplay.innerHTML = Closet.renderTemplate(code, filterManager)
        if (!keepMemory) {
            filterManager.clearMemory()
        }

        for (const btn of allButtons.get(id)) {
            btn.classList.remove('active')
        }
        btnRerender.classList.add('active')

        currentPreset.set(id, preset)
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

const readyTryButton = (id, code) => {
    const buttonQuery = `${id} .btn-edit`
    const btnEdit = document.querySelector(buttonQuery)

    btnEdit.addEventListener('click', () => {
        const link = `/closet/tester?text=${encodeURIComponent(code.replace(/<br \/>/g, '\n'))}&preset=${encodeURIComponent(JSON.stringify(currentPreset.get(id), null, 2))}`

        window.location = link
    })
}
