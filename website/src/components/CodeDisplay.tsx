import React, { Component, createRef } from "react"
import Prism from "prismjs"

import * as closet from "closetjs"
import "@site/src/css/CodeDisplay.css"

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

const setupPattern = /^.*\}/gsu
const prepareSetupCode = (moduleCode: string): string => {
  const match = moduleCode.match(setupPattern)

  if (!match) {
    throw new Error(`Module has invalid formatting: ${moduleCode}`)
  }

  return match[0]
}

type CodeDisplayProps = { setup: string, example: string }
type CodeDisplayState = { setupCode: string }

class CodeDisplay extends Component<CodeDisplayProps, CodeDisplayState> {
  codeContainer

  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = { setupCode: "" }
    this.codeContainer = createRef()
  }

  async componentDidMount() {
    const setupName = this.props.setup
    const exampleName = this.props.example

    try {
      const setup = await import(`@site/src/setups/${setupName}`)
      const setupCode = await import(`!raw-loader!@site/src/setups/${setupName}/setup`)
        .then((module: NodeModule) => module["default"])
        .then(prepareSetupCode)

      this.setState({ setupCode })
    }
    catch (error) {
      console.log(error)
    }

    if (this.codeContainer.current) {
      Prism.highlightElement(this.codeContainer.current)
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {}
  }

  render() {
    return (
      <pre><code ref={this.codeContainer} className="language-closet">
        This is a [[c1::Test]] Foobar [[c2::meh]]
      </code></pre>
    )
  }

}

export default CodeDisplay;
