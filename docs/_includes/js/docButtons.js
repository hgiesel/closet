const allButtons = new Map()

const currentPresets = {}
const lastButtons = {}

const readyRenderButton = (
    id,
    btnId,
    code,
    preset,
    filterManager,
) => {
    const buttonQuery = `${id} .btn-${btnId}`
    const displayQuery = `${id} > .output-display`

    const theDisplay = document.querySelector(displayQuery)
    const btnRerender = document.querySelector(buttonQuery)

    if (allButtons.has(id)) {
        allButtons.get(id).push(btnRerender)
    }
    else {
        allButtons.set(id, [btnRerender])
    }

    btnRerender.addEventListener('click', () => {
        // decide whether to clear memory
        const currentButtonIndex = allButtons.get(id).findIndex(v => v === btnRerender)

        if (currentButtonIndex === lastButtons[id]) {
            filterManager.clear()
        }

        lastButtons[id] = currentButtonIndex

        // render
        const tmpl = closet.Template.make(code)
        filterManager.switchPreset(preset)

        tmpl.render(filterManager, output => theDisplay.innerHTML = output)

        // update render buttons
        for (const btn of allButtons.get(id)) {
            btn.classList.remove('active')
        }
        btnRerender.classList.add('active')

        currentPresets[id] = preset
    })

    return btnRerender
}

const readyFmButton = (id, _fmCode) => {
    const buttonQuery = `${id} .btn-fm`
    const displayQuery = `${id} .fm-display`

    const fmButton = document.querySelector(buttonQuery)
    const fmDisplay = document.querySelector(displayQuery)

    fmButton.addEventListener('click', () => {
        fmDisplay.style.display = 'block'

        const closePane = (event) => {
            const isClickInside = fmDisplay.contains(event.target)
            if (!isClickInside) {
                fmDisplay.style.display = 'none'
                event.currentTarget.removeEventListener(event.type, closePane)
            }
        }

        document.addEventListener('mousedown', closePane)
    })
}

const readyTryButton = (
    id,
    code,
    setupString,
) => {
    const buttonQuery = `${id} .btn-edit`
    const btnEdit = document.querySelector(buttonQuery)

    btnEdit.addEventListener('click', () => {
        const linkBase = '/tester'
        const textComp = `?text=${encodeURIComponent(code.replace(/<br \/>/g, '\n'))}`
        const presetComp = `&preset=${encodeURIComponent(JSON.stringify(currentPresets[id]))}`
        const setupsComp = `&setups=${setupString}`
        const memoryComp = '&memory=f'

        window.location = (
            linkBase +
            textComp +
            presetComp +
            setupsComp +
            memoryComp
        )
        })
    }
