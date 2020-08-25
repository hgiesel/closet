var EditorCloset = {
    editorOcclusion: Closet.browserRecipes.makeOcclusions({
        occlusionTextHandler: (_occs, texts) => {
            pycmd(`copyToClipboard:${texts.join("\n")}`)
            EditorCloset.clearOcclusionMode()
        },
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
                Closet.browserRecipes.rectShow({ tagname: 'rect' }),
                Closet.browserRecipes.rectHide({ tagname: 'recth' }),
                Closet.browserRecipes.rectReveal({ tagname: 'rectr' }),
            )

            Closet.BrowserTemplate
                .makeFromNodes(elements)
                .render(filterManager)

            EditorCloset.occlusionMode = true
        }
    },
}
