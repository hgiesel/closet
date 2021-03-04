import React, { useEffect, useState, useRef } from "react"
import Prism, { highlight, highlightElement } from "prismjs"

import "./styles.css"


Prism.languages.closet = {
    tagopen: {
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

type ExampleSyntaxProps = { text: string, className: string }

const ExampleSyntax = ({ text, className = "" }: ExampleSyntaxProps) => {
  const codeContainer = useRef()

  const [
    highlightedText,
    setHighlightedText,
  ] = useState("");

  useEffect(() => {
    const highlighted = highlight(text.replace(/</gu, "%LESSTHAN%"), Prism.languages.closet, "closet")
      .replace(/%LESSTHAN%/gu, "<")

    setHighlightedText(highlighted)
    highlightElement(codeContainer.current)
  }, [text])

  return (
    <pre className={className}>
      <code
        className="language-closet"
        ref={codeContainer}
        dangerouslySetInnerHTML={{__html: highlightedText}}
      ></code>
    </pre>
  )
};

export default ExampleSyntax;
