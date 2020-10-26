var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

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

            pycmd(`copyToClipboard:${shapeText}`)
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
        filterManager.install(
            editorOcclusion,
            closet.browser.recipes.rect.show({ tagname: 'rect' }),
            closet.browser.recipes.rect.hide({ tagname: 'recth' }),
            closet.browser.recipes.rect.reveal({ tagname: 'rectr' }),
        )

        closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)

        EditorCloset.occlusionMode = true
    },

    occlusionMode: false,
    clearOcclusionMode: () => {
        let field_idx = 0

        while (true) {
            const field = document.getElementById(`f${field_idx}`)

            if (!field) {
                break
            }

            else if (field.innerHTML.includes('<div class="closet__occlusion-container">')) {
                pycmd(`clearOcclusionMode:${field_idx}:${field.innerHTML}`, (repl) => {
                    field.innerHTML = repl
                })
            }

            field_idx++
        }

        EditorCloset.occlusionMode = false
    },

    toggleOcclusionMode: () => {
        if (EditorCloset.occlusionMode) {
            EditorCloset.clearOcclusionMode()
        }
        else {
            import('/__closet.js')
                .then(
                    EditorCloset.setupOcclusionEditor,
                    error => console.error('Could not load Closet:', error),
                )
        }
    },
}
