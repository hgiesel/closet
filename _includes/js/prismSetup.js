Prism.languages.closet = {
    tagstart: {
        pattern: /\[\[[a-zA-Z]+\d*/u,
        inside: {
            tagstart: /\[\[/u,
            tagname: /[a-zA-Z]+\d*/u,
        },
    },
    tagend: /\]\]/,
    altsep: /\|\|/,
    argsep: /::/,
}
