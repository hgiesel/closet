import React, { Component, createRef, RefObject } from "react"
import Prism from "prismjs"

import "@site/src/css/ExampleSyntax.css"

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

type ExampleSyntaxProps = { text: string }
type ExampleSyntaxState = { highlightedText: string }

const defaultState = { highlightedText: "" }

class ExampleSyntax extends Component<ExampleSyntaxProps, ExampleSyntaxState> {
  codeContainer: RefObject<HTMLElement>

  constructor(props: ExampleSyntaxProps) {
    super(props)
    this.codeContainer = createRef()
    this.state = defaultState
  }

  static getDerivedStateFromProps(props: ExampleSyntaxProps): ExampleSyntaxState {
    const highlightedText = Prism.highlight(props.text.replace(/</gu, "%LESSTHAN%"), Prism.languages.closet, "closet")
      .replace(/%LESSTHAN%/gu, "<")
      .replace(/\n/gu, "")
      .replace(/(?<=>)[ ]+?(?=<)/gu, "")

    return { highlightedText }
  }

  componentDidMount() {
    Prism.highlightElement(this.codeContainer.current)
  }

  render() {
    return (
      <pre>
        <code
          className="language-closet"
          ref={this.codeContainer}
          dangerouslySetInnerHTML={{__html: this.state.highlightedText}}
        ></code>
      </pre>
    )
  }

}

export default ExampleSyntax;
