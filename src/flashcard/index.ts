import type { Recipe } from "../types";
import type { FlashcardPreset } from "./flashcardTemplate";

export type { FlashcardPreset } from "./flashcardTemplate";
export interface FlashcardRecipes {
    show: Recipe<FlashcardPreset>;
    hide: Recipe<FlashcardPreset>;
    reveal: Recipe<FlashcardPreset>;
}

export * as deciders from "./deciders";
export { FlashcardBehavior as behaviors } from "./flashcardTemplate";

import { clozeRecipes as cloze } from "./cloze";
import { multipleChoiceRecipes as multipleChoice } from "./multipleChoice";
import { specRecipes as specification } from "./spec";

import {
    mingleRecipes as mingle,
    sortRecipes as sort,
    jumbleRecipes as jumble,
} from "./shuffleQuestion";

export const recipes = {
    cloze,
    multipleChoice,
    specification,
    mingle,
    sort,
    jumble,
};
