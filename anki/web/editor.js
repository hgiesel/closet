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

        Closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)
    },
}
