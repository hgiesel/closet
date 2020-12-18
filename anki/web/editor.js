var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

    occlusionMode: false,
    occlusionEditorTarget: null,
    getOcclusionButton: () => document.getElementById("closetOcclude"),

    setActive: (target) => {
        EditorCloset.occlusionEditorTarget = target
        EditorCloset.occlusionMode = true
        EditorCloset.getOcclusionButton().classList.add("highlighted")
        pycmd('occlusionEditorActive')
    },

    setInactive: () => {
        EditorCloset.occlusionEditorTarget = null
        EditorCloset.occlusionMode = false
        EditorCloset.getOcclusionButton().classList.remove("highlighted")
        pycmd('occlusionEditorInactive')
    },

    setupOcclusionEditor: (closet, maxOcclusions) => {
        const elements = ['[[makeOcclusions]]']
            .concat(...document.body.querySelectorAll('.field'))

        const acceptHandler = (_entry, internals) => (shapes, draw) => {
            const imageSrc = draw.image.src.match(EditorCloset.imageSrcPattern)[1]

            const newIndices = [...new Set(shapes
                .map(shape => shape.labelText)
                .map(label => label.match(closet.keySeparationPattern))
                .filter(match => match)
                .map(match => Number(match[2]))
                .filter(maybeNumber => !Number.isNaN(maybeNumber))
            )]

            pycmd(`newOcclusions:${imageSrc}:${newIndices.join(',')}`)

            const shapeText = shapes
                .map(shape => shape.toText(internals.template.parser.delimiters))
                .join("\n")


            pycmd(`occlusionText:${shapeText}`)

            EditorCloset.clearOcclusionMode()
        }

        const existingShapesFilter = () => (shapeDefs, draw) => {
            const indices = [...new Set(shapeDefs
                .map(shape => shape[2])
                .map(label => label.match(closet.keySeparationPattern))
                .filter(match => match)
                .map(match => Number(match[2]))
                .filter(maybeNumber => !Number.isNaN(maybeNumber))
            )]

            const imageSrc = draw.image.src.match(EditorCloset.imageSrcPattern)[1]
            pycmd(`oldOcclusions:${imageSrc}:${indices.join(',')}`)

            return shapeDefs
        }

        const editorOcclusion = closet.browser.recipes.occlusionEditor({
            maxOcclusions,
            acceptHandler,
            existingShapesFilter,
        })

        const filterManager = closet.FilterManager.make()
        const target = editorOcclusion(filterManager.registrar)

        filterManager.install(closet.browser.recipes.rect({ tagname: 'rect' }))

        closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)

        EditorCloset.setActive(target)
    },

    clearOcclusionMode: () => {
        const fieldsWithOcclusionContainer = function*() {
            let field_idx = 0
            let field = null

            while (field = document.getElementById(`f${field_idx}`)) {
                if (field.innerHTML.includes('<div class="closet-occlusion-container">')) {
                    yield [field_idx, field]
                }
                field_idx++
            }
        }

        const fields = Array.from(fieldsWithOcclusionContainer())
        EditorCloset.occlusionEditorTarget.dispatchEvent(new Event('reject'))

        fields.forEach(([index, field]) => {
            pycmd(`key:${index}:${currentNoteId}:${field.innerHTML}`)
        })

        EditorCloset.setInactive()
    },

    // is what is called from the UI
    toggleOcclusionMode: (versionString, maxOcclusions) => {
        if (EditorCloset.occlusionMode) {
            EditorCloset.clearOcclusionMode()
        }
        else {
            import(`/__closet-${versionString}.js`)
                .then(
                    closet => EditorCloset.setupOcclusionEditor(closet, maxOcclusions),
                    error => console.log('Could not load Closet:', error),
                )
        }
    },
}
