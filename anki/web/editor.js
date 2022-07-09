/** tweening **/
var rushInOut = (x) => {
    return 2.388 * x - 4.166 * Math.pow(x, 2) + 2.77 * Math.pow(x, 3);
};

/** Python functions moved to JS for async operations **/
var escape_js_text = (text) => {
    return text.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'");
}

var replace_or_prefix_old_occlusion_text = (old_html, new_text) => {
    const occlusion_block_regex = /\[#!occlusions.*?#\]/;

    const new_html = new_text.split(/\r?\n/).join("<br>");
    replacement = `[#!occlusions ${new_html} #]`;

    /** imitate re.subn **/
    [subbed, number_of_subs] = ((count = 0) => {
        const subbed = old_html.replace(occlusion_block_regex, () => {
            ++count;
            return replacement;
        })
        return [subbed, count];
    })();
    
    if (number_of_subs > 0) {
        return subbed;
    } else if (["", "<br>"].includes(old_html)) {
        return replacement;
    } else {
        return `${replacement}<br>${old_html}`;
    } 
}


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


EditorField.lifecycle.onMount(async (field) => {
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
})

var EditorCloset = {
    imageSrcPattern: /^https?:\/\/(?:localhost|127.0.0.1):\d+\/(.*)$/u,

    occlusionMode: false,
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
        return await get(EditorField.instances[index].editingArea.editingInputs)
        .find((input) => input.name === "rich-text")
        .element;
    },

    setupOcclusionEditor: async (closet, maxOcclusions) => {
        const fieldElements = [];
        const subscriptionCallbacks = [];

        for (const field of EditorField.instances) {
            const richTextInputAPI = get(field.editingArea.editingInputs)
                .find((input) => input.name === "rich-text");
            subscriptionCallbacks.push(richTextInputAPI.preventResubscription());
            fieldElements.push(await richTextInputAPI.element);
        }

        const elements = ["[[makeOcclusions]]"].concat(...fieldElements);

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

            subscriptionCallbacks.forEach((resubscribe) => resubscribe());
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
        const editingAreas = [];

        for (const field of EditorField.instances) {
            const editingArea = field.editingArea;
            const richTextEditable = await get(field.editingArea.editingInputs).find((input) => input.name === "rich-text").element;

            if (
                richTextEditable.innerHTML.includes(
                    '<div class="closet-occlusion-container">',
                )
            ) {
                editingAreas.push(editingArea);
            }
        }

        EditorCloset.occlusionEditorTarget.dispatchEvent(new Event("reject"));

        editingAreas.forEach((field) => {
            field.content.update(v => v);
            // console.log('fieldd', field);
            // bridgeCommand(
            //     `key:${index}:${getNoteId()}:${get(field.content)}`,
            // );
        });

        EditorCloset.setInactive();
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

    insertIntoZeroIndexed: async (new_text, index) => {
        const old_html = await EditorCloset.getFieldHTML(index);
        const text = replace_or_prefix_old_occlusion_text(old_html, new_text);

        const escaped = escape_js_text(text);

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
