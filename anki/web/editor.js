var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

    occlusionMode: false,
    occlusionEditorTarget: null,

    setActive: (target) => {
        EditorCloset.occlusionEditorTarget = target
        EditorCloset.occlusionMode = true
        pycmd('occlusionEditorActive')
    },

    setInactive: () => {
        EditorCloset.occlusionEditorTarget = null
        EditorCloset.occlusionMode = false
        pycmd('occlusionEditorInactive')
    },

    setupOcclusionEditor: (closet) => {
        const elements = ['[[makeOcclusions]]'].concat(...document.body.querySelectorAll('.field'))

        const acceptHandler = (_entry, internals) => (shapes, draw) => {
            const shapeText = shapes
                .map(shape => shape.toText(internals.template.parser.delimiters))
                .join("\n")

            const newIndices = [...new Set(shapes
                .map(shape => shape.labelText)
                .map(label => label.match(closet.keySeparationPattern))
                .filter(match => match)
                .map(match => Number(match[2]))
                .filter(maybeNumber => !Number.isNaN(maybeNumber))
            )]

            const imageSrc = draw.image.src.match(EditorCloset.imageSrcPattern)[1]

            pycmd(`occlusionText:${shapeText}`)
            pycmd(`newOcclusions:${imageSrc}:${newIndices.join(',')}`)

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
            acceptHandler,
            existingShapesFilter,
        })

        const filterManager = closet.FilterManager.make()
        const target = editorOcclusion(filterManager.registrar)

        filterManager.install(
            closet.browser.recipes.rect.hide({ tagname: 'rect' }),
            closet.browser.recipes.rect.show({ tagname: 'rects' }),
            closet.browser.recipes.rect.reveal({ tagname: 'rectr' }),
        )

        closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)

        EditorCloset.setActive(target)
    },

    clearOcclusionMode: () => {
        if (!EditorCloset.occlusionMode) {
            console.log('Tried to clear already cleared occlusion mode')
            return
        }

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

    toggleOcclusionMode: () => {
        if (EditorCloset.occlusionMode) {
            EditorCloset.clearOcclusionMode()
        }
        else {
            pycmd('closetVersion', (versionString) => {
                import(`/__closet-${versionString}.js`)
                    .then(
                        EditorCloset.setupOcclusionEditor,
                        error => console.log('Could not load Closet:', error),
                    )
            })
        }
    },
}
