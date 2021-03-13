import type { TagNode, Recipe, InactiveBehavior } from "../types";
import type { FlashcardTemplate, FlashcardPreset } from "./flashcardTemplate";

import {
    makeFlashcardTemplate,
    generateFlashcardRecipes,
} from "./flashcardTemplate";

const insert = (tag: TagNode) => ({ result: tag.values, parse: true });
const noinsert = () => "";

const specPublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (
    options: {
        tagname?: string;
        flashcardTemplate?: FlashcardTemplate<T>;
    } = {},
) => {
    const {
        tagname = "spec",
        flashcardTemplate = makeFlashcardTemplate(),
    } = options;

    const specOptions = { capture: true };
    const specRecipe = flashcardTemplate(frontInactive, backInactive);

    return specRecipe(tagname, insert, insert, insert, noinsert, specOptions);
};

export const specRecipes = generateFlashcardRecipes(specPublicApi);
