const theId = '#{{ include.content.name | slugify }}'
const theCode = '{{ include.content.code | replace: "'", "\\'" | newline_to_br | strip_newlines }}'
document.querySelector(`${theId} > button`).addEventListener('click', () => {
    const fm = mkFilterManager()
    document.querySelector(`${theId} > .display`).innerHTML = renderTemplate(theCode, fm)
})
