import React, { Component, createRef } from "react"
import Prism from "prismjs"

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

const setupPattern = /^function.*?^\}/msu

const getSetupCode = (moduleCode: string): string => {
  const match = setupPattern.exec(moduleCode)

  if (!match) {
    throw new Error(`Module has invalid formatting: ${moduleCode}`)
  }

  return match[0]
}

type CodeDisplayProps = { setupName: string }
type CodeDisplayState = { setupCode: string }

class CodeDisplay extends Component<CodeDisplayProps, CodeDisplayState> {
  codeContainer

  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = { setupCode: "" }
    this.codeContainer = createRef()
  }

  async componentDidMount() {
    const file = `${this.props.setupName}.js`

    try {
      const setupAsString = await import(`!raw-loader!@site/src/setups/${file}`)
      const setup = await import(`@site/src/setups/${file}`)

      const setupCode = getSetupCode(setupAsString.default)
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
