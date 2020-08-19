var EditorCloset = {
    editorOcclusion: Closet.browserRecipes.makeOcclusions({
        occlusionTextHandler: (_occs, texts) => {
            pycmd(`copyToClipboard:${texts.join("\n")}`)
            pycmd('clearOcclusionMode')
        },
    }),

    occlusionMode: () => {
        const elements = ['[[makeOcclusions]]'].concat(...document.body.querySelectorAll('.field'))

        const filterManager = new Closet.FilterManager()
        filterManager.setPreset({})
        filterManager.addRecipe(EditorCloset.editorOcclusion)

        filterManager.addRecipe(Closet.browserRecipes.rectShow({ tagname: 'rect' })),
        filterManager.addRecipe(Closet.browserRecipes.rectHide({ tagname: 'recth' })),
        filterManager.addRecipe(Closet.browserRecipes.rectReveal({ tagname: 'rectr' })),

        Closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)
    },
}
