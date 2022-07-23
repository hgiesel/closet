/** tweening **/
var rushInOut = (x) => {
    return 2.388 * x - 4.166 * Math.pow(x, 2) + 2.77 * Math.pow(x, 3);
};

/** Python functions moved to JS for async operations **/
var escapeJSText = (text) => {
    return text.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'");
}

var getFocusedFieldIndex = () => {
    if (document.activeElement.classList.contains("rich-text-editable")) {
        return [...document.querySelector(".fields").children]
        .indexOf(
            document.activeElement.closest(".editor-field").parentNode
        )
    }
    else return 0;
}

var replaceOrPrefixOldOcclusionText = (oldHTML, newText) => {
    const occlusionBlockRegex = /\[#!occlusions.*?#\]/;

    const newHTML = newText.split(/\r?\n/).join("<br>");
    replacement = `[#!occlusions ${newHTML} #]`;

    /** imitate re.subn **/
    [subbed, numberOfSubs] = ((count = 0) => {
        const subbed = oldHTML.replace(occlusionBlockRegex, () => {
            ++count;
            return replacement;
        })
        return [subbed, count];
    })();
    
    if (numberOfSubs > 0) {
        return subbed;
    } else if (["", "<br>"].includes(oldHTML)) {
        return replacement;
    } else {
        return `${replacement}<br>${oldHTML}`;
    } 
}

const NoteEditor = require("anki/NoteEditor");
const EditorField = require("anki/EditorField");
const { get } = require("svelte/store");

const occlusionCss = `
img {
  max-width: 100% !important;
  max-height: var(--closet-max-height);
}

.closet-rect__rect {
  fill: moccasin;
  stroke: olive;
}

.is-active .closet-rect__rect {
  fill: salmon;
  stroke: yellow;
}

.closet-rect__ellipsis {
  fill: transparent;
  stroke: transparent;
}

.closet-rect__label {
  stroke: black;
  stroke-width: 0.5;
}`

/** Cloze support for non-cloze notetypes on 2.1.50+ **/
document.addEventListener("keydown", (evt) => {
    if (evt.ctrlKey && evt.shiftKey && evt.code == "KeyC") {
        pycmd("closetCloze");
    }
});

EditorField.lifecycle.onMount((field) => {
    (async() => {
        const fieldElement = await field.element;

        if (!fieldElement.hasAttribute("has-occlusion-style")) {
            const style = document.createElement("style");
            style.id = "closet-occlusion-style"
            style.rel = "stylesheet";
            style.textContent = occlusionCss;
            const richTextEditable = await get(field.editingArea.editingInputs)
                .find((input) => input.name === "rich-text")
                .element;
            richTextEditable.getRootNode().prepend(style);
    
            fieldElement.setAttribute("has-occlusion-style", "");
        }
    })();
});

var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

    focusIndex: 0,
    occlusionMode: false,
    occlusionField: null,
    occlusionEditorTarget: null,
    getOcclusionButton: () => document.getElementById("closetOcclude"),

    setActive: (target) => {
        EditorCloset.occlusionEditorTarget = target;
        EditorCloset.occlusionMode = true;
        EditorCloset.getOcclusionButton().classList.add("highlighted");
        bridgeCommand("occlusionEditorActive");
    },

    setInactive: () => {
        EditorCloset.occlusionEditorTarget = null;
        EditorCloset.occlusionMode = false;
        EditorCloset.getOcclusionButton().classList.remove("highlighted");
        bridgeCommand("occlusionEditorInactive");
    },

    getFieldHTML: async (index) => {
        const richTextEditable = await EditorCloset.getRichTextEditable(index)
        return richTextEditable.innerHTML;
    },

    setFieldHTML: async (index, html) => {
        const richTextEditable = await EditorCloset.getRichTextEditable(index);
        richTextEditable.innerHTML = html;
    },

    getRichTextEditable: async (index) => {
        return await get(NoteEditor.instances[0].fields[index].editingArea.editingInputs)
        .find((input) => input.name === "rich-text")
        .element;
    },

    setupOcclusionEditor: async (closet, maxOcclusions) => {
        const elements = ["[[makeOcclusions]]"];

        for (const field of NoteEditor.instances[0].fields) {
            const richTextInputAPI = get(field.editingArea.editingInputs)
                .find((input) => input.name === "rich-text");
            
            const richTextEditable = await richTextInputAPI.element;
            if (
                richTextEditable.querySelector("img")
                && !EditorCloset.occlusionField
            ) {
                EditorCloset.occlusionField = {
                    editingArea: field.editingArea,
                    callback: richTextInputAPI.preventResubscription(),
                };
                field.editingArea.refocus();
            }
            elements.push(richTextEditable);
        }


        const acceptHandler = (_entry, internals) => (shapes, draw) => {
            const imageSrc = draw.image.src.match(
                EditorCloset.imageSrcPattern,
            )[1];

            const newIndices = [
                ...new Set(
                    shapes
                        .map((shape) => shape.labelText)
                        .map((label) =>
                            label.match(closet.patterns.keySeparation),
                        )
                        .filter((match) => match)
                        .map((match) => Number(match[2]))
                        .filter((maybeNumber) => !Number.isNaN(maybeNumber)),
                ),
            ];

            bridgeCommand(`newOcclusions:${imageSrc}:${newIndices.join(",")}`);

            const shapeText = shapes
                .map((shape) =>
                    shape.toText(internals.template.parser.delimiters),
                )
                .join("\n");

            bridgeCommand(`occlusionText:${shapeText}`);

            EditorCloset.clearOcclusionMode();
        };

        const setupOcclusionMenu = (menu) => {
            menu.splice(1, 0, {
                label: `<input
                    type="range"
                    min="1"
                    max="100"
                    value="${EditorCloset.maxHeightPercent}"
                    oninput="EditorCloset.handleMaxHeightChange(window.event)"
                />`,
                html: true,
            });

            return menu;
        };

        const existingShapesFilter = () => (shapeDefs, draw) => {
            const indices = [
                ...new Set(
                    shapeDefs
                        .map((shape) => shape[2])
                        .map((label) =>
                            label.match(closet.patterns.keySeparation),
                        )
                        .filter((match) => match)
                        .map((match) => Number(match[2]))
                        .filter((maybeNumber) => !Number.isNaN(maybeNumber)),
                ),
            ];

            const imageSrc = draw.image.src.match(
                EditorCloset.imageSrcPattern,
            )[1];
            bridgeCommand(`oldOcclusions:${imageSrc}:${indices.join(",")}`);

            return shapeDefs;
        };

        const editorOcclusion = closet.browser.recipes.occlusionEditor({
            maxOcclusions,
            acceptHandler,
            setupOcclusionMenu,
            existingShapesFilter,
        });

        const filterManager = closet.FilterManager.make();
        const target = editorOcclusion(filterManager.registrar);

        filterManager.install(
            ...["rect", "recth", "rectr"].map((tagname) =>
                closet.browser.recipes.rect.hide({ tagname }),
            ),
        );

        closet.template.BrowserTemplate.makeFromNodes(elements).render(
            filterManager,
        );

        EditorCloset.setActive(target);
    },

    clearOcclusionMode: async () => {
        if (EditorCloset.occlusionMode) {

            EditorCloset.occlusionEditorTarget.dispatchEvent(new Event("reject"));

            EditorCloset.occlusionField.callback.call();
            EditorCloset.focusIndex = getFocusedFieldIndex();

            EditorCloset.hadOcclusionEditor = true;
            EditorCloset.setInactive();
        }
    },

    refocusField: () => {
        if (EditorCloset.hadOcclusionEditor) {
            EditorCloset.occlusionField.editingArea.refocus();
            EditorCloset.hadOcclusionEditor = false;
        }
    },

    // is what is called from the UI
    toggleOcclusionMode: (versionString, maxOcclusions) => {
        if (EditorCloset.occlusionMode) {
            EditorCloset.clearOcclusionMode();
        } else {
            import(`/__closet-${versionString}.js`).then(
                (closet) =>
                    EditorCloset.setupOcclusionEditor(
                        closet.closet,
                        maxOcclusions,
                    ),
                (error) => console.log("Could not load Closet:", error),
            );
        }
    },

    insertIntoZeroIndexed: async (newText, index) => {
        const oldHTML = await EditorCloset.getFieldHTML(index);
        const text = replaceOrPrefixOldOcclusionText(oldHTML, newText);

        const escaped = escapeJSText(text);

        pycmd(`key:${index}:${getNoteId()}:${escaped}`);
        EditorCloset.setFieldHTML(index, escaped);
    },

    /**************** CLOSET MODE ****************/
    setClosetMode: (mode) => {
        document.getElementById("closetMode").selectedIndex = mode;
    },

    /**************** MAX HEIGHT *****************/
    handleMaxHeightChange: (event) => {
        EditorCloset.setMaxHeightPercent(Number(event.currentTarget.value));
    },

    maxHeightPercent: 0,
    setMaxHeightPercent: (value /* 1 <= x <= 100 */) => {
        const maxMaxHeight = globalThis.screen.height;
        const factor = rushInOut(value / 100);

        EditorCloset.maxHeightPercent = value;
        EditorCloset.setMaxHeight(factor * maxMaxHeight);
    },

    setMaxHeight: (value /* > 0 */) => {
        document.documentElement.style.setProperty(
            "--closet-max-height",
            `${value}px`,
        );
    },
};
