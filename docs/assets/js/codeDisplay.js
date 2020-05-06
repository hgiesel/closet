const theId = '#{{ include.content.name | slugify }}'
const theCode = '{{ include.content.code | replace: "'", "\\'" | newline_to_br | strip_newlines }}'

const theElement = document.querySelector(`${theId} > button`)
const theDisplay = document.querySelector(`${theId} > .display`)

theElement.addEventListener('click', () => {
    const filterManager = mkFilterManager()
    filterManager.addRecipe(filterRecipes.mix('mix', ', '))

    theDisplay.innerHTML = renderTemplate(theCode, filterManager)
})

theElement.dispatchEvent(new Event('click'))
