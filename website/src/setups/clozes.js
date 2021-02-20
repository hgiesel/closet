export const title = "Clozes default";
export const functionName = "clozes";

function clozes(closet, filterManager, preset, memory) {
    filterManager.install(closet.flashcard.recipes.cloze({
        tagname: 'c',
    }))


}
