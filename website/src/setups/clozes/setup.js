function clozes(closet, filterManager, _preset, _memory) {
  filterManager.install(
    closet.flashcard.recipes.cloze({
      tagname: "c",
    }),
  );
}

export default clozes;
