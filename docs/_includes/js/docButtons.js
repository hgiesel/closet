const allButtons = new Map()
const currentPreset = new Map()

let currentKeepMemories = {}

const readyRenderButton = (
    id,
    btnId,
    code,
    preset,
    keepMemory,
    filterManager = new Closet.FilterManager(preset),
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
        Closet.renderTemplate(code, filterManager, output => theDisplay.innerHTML = output)

        currentKeepMemories[id] = keepMemory

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
    filterManagerId,
) => {
    const buttonQuery = `${id} .btn-edit`
    const btnEdit = document.querySelector(buttonQuery)

    btnEdit.addEventListener('click', () => {
        const linkBase = '/tester'
        const textComp = `?text=${encodeURIComponent(code.replace(/<br \/>/g, '\n'))}`
        const presetComp = `&preset=${encodeURIComponent(JSON.stringify(currentPreset.get(id)))}`
        const fmComp = `&fm=${filterManagerId}`
        const memoryComp = `&memory=${String(currentKeepMemories[id])[0]}`

        window.location = (
            linkBase +
            textComp +
            presetComp +
            fmComp +
            memoryComp
        )
        })
    }
