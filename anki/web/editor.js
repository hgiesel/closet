var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

    editorOcclusion: Closet.browser.recipes.occlusionEditor({
        acceptHandler: (shapes, draw) => {
            const shapeText = shapes.map(shape => shape.toText()).join("\n")

            const newIndices = [...new Set(shapes
                .map(shape => shape.labelText)
                .map(label => label.match(Closet.keySeparationPattern))
                .filter(match => match)
                .map(match => Number(match[2]))
                .filter(maybeNumber => !Number.isNaN(maybeNumber))
            )]

            const imageSrc = draw.image.src.match(EditorCloset.imageSrcPattern)[1]

            pycmd(`copyToClipboard:${shapeText}`)
            pycmd(`newOcclusions:${imageSrc}:${newIndices.join(',')}`)

            EditorCloset.clearOcclusionMode()
        },
        existingShapesFilter: (shapeDefs, draw) => {
            const indices = [...new Set(shapeDefs
                .map(shape => shape[2])
                .map(label => label.match(Closet.keySeparationPattern))
                .filter(match => match)
                .map(match => Number(match[2]))
                .filter(maybeNumber => !Number.isNaN(maybeNumber))
            )]

            const imageSrc = draw.image.src.match(EditorCloset.imageSrcPattern)[1]
            pycmd(`oldOcclusions:${imageSrc}:${indices.join(',')}`)

            return shapeDefs
        }
    }),

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
            const elements = ['[[makeOcclusions]]'].concat(...document.body.querySelectorAll('.field'))

            const filterManager = Closet.FilterManager.make()
            filterManager.install(
                EditorCloset.editorOcclusion,
                Closet.browser.recipes.rect.show({ tagname: 'rect' }),
                Closet.browser.recipes.rect.hide({ tagname: 'recth' }),
                Closet.browser.recipes.rect.reveal({ tagname: 'rectr' }),
            )

            Closet.BrowserTemplate
                .makeFromNodes(elements)
                .render(filterManager)

            EditorCloset.occlusionMode = true
        }
    },
}
