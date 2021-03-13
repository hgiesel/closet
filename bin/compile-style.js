const fs = require("fs");
const path = require("path");
const sass = require("sass");

const __basedir = `${__dirname}/..`;
const args = process.argv.slice(2);

const renderFile = (input, output) => {
    sass.render(
        {
            file: input,
        },
        (error, result) => {
            if (error) {
                console.error(error);
                return;
            }

            fs.writeFile(output, result.css, (error) => {
                if (error) {
                    return console.log(error);
                }

                console.log(`SCSS was successfully compiled to ${output}`);
            });
        },
    );
};

const renderFromArg = (arg) => {
    switch (arg) {
        case "anki":
            renderFile(
                path.join(__basedir, "style", "editor.scss"),
                `${__basedir}/anki/web/editor.css`,
            );

            renderFile(
                path.join(__basedir, "style", "base.scss"),
                `${__basedir}/anki/web/closet.css`,
            );
            break;

        case "dist":
            renderFile(
                path.join(__basedir, "style", "base.scss"),
                `${__basedir}/dist/closet.css`,
            );
            break;

        case "docs":
            renderFile(
                path.join(__basedir, "style", "base.scss"),
                `${__basedir}/docs/assets/css/closet.css`,
            );
            break;
    }
};

renderFromArg(args[0]);
