const yaml = require("js-yaml");
const fs = require("fs");
const jsonschema = require("jsonschema");

const setupsDirectory = "docs/_data/setups";

const simpleVersionPattern = "^v(?:\\d+)(?:\\.\\d+)*$";
const versionPattern =
    "v(?:\\d+)\\.(?:\\d+)\\.(?:\\d+)(?:-(?:\\w+)(?:\\.\\w+)*)?";

const setupSchema = {
    definitions: {
        setup: {
            type: "object",
            additionalProperties: false,
            required: ["name", "documentation", "versions"],
            properties: {
                name: {
                    type: "string",
                },
                documentation: {
                    type: "string",
                },
                versions: {
                    type: "array",
                    minItems: 1,
                    items: {
                        $ref: "#/definitions/version",
                    },
                },
            },
        },

        version: {
            type: "object",
            additionalProperties: false,
            required: ["name", "code", "support"],
            properties: {
                name: {
                    type: "string",
                    pattern: simpleVersionPattern,
                },
                note: {
                    type: "string",
                },
                support: {
                    $ref: "#/definitions/support",
                },
                code: {
                    type: "string",
                },
            },
        },

        support: {
            type: "object",
            additionalProperties: false,
            required: ["from"],
            properties: {
                supportStart: {
                    type: "string",
                    pattern: versionPattern,
                },
                supportEnd: {
                    type: "string",
                    pattern: versionPattern,
                },
            },
        },
    },

    $ref: "#/definitions/setup",
};

fs.readdir(setupsDirectory, (_err, setupFiles) => {
    for (const setupFile of setupFiles) {
        fs.readFile(
            `${setupsDirectory}/${setupFile}`,
            "utf-8",
            (_err, content) => {
                const doc = yaml.safeLoad(content, {
                    filename: setupFile,
                });
            },
        );
    }
});
