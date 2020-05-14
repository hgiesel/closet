const readyRenderButton = (buttonQuery, displayQuery, code, filterManager = new FilterManager()) => {
    const theDisplay = document.querySelector(displayQuery)
    const btnRerender = document.querySelector(buttonQuery)

    btnRerender.addEventListener('click', () => {
        theDisplay.innerHTML = closet.renderTemplate(code, filterManager)
        filterManager.reset()
    })

    btnRerender.dispatchEvent(new Event('click'))
}

const readyTryButton = (buttonQuery, code, preset) => {
    const btnEdit = document.querySelector(buttonQuery)

    btnEdit.addEventListener('click', () => {
        const link = `/closet/tester?text=${encodeURIComponent(code.replace(/<br \/>/g, '\n'))}&preset=${encodeURIComponent(preset)}`

        window.location = link
    })
}
