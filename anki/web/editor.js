var EditorCloset = {
    occlusionMode: () => {
        const elements = ['[[makeOcclusions]]'].concat(...document.body.querySelectorAll('.field'))

        const filterManager = new Closet.FilterManager()
        filterManager.setPreset({})
        filterManager.addRecipe(Closet.browserRecipes.makeOcclusions())

        const result = Closet.BrowserTemplate
            .makeFromNodes(elements)
            .render(filterManager)
    }
}
