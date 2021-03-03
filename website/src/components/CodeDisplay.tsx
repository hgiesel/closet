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

type CodeDisplayProps = { example: string }
type CodeDisplayState = {
  exampleText: string,
}

class CodeDisplay extends Component<CodeDisplayProps, CodeDisplayState> {
  codeContainer

  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = { exampleText: "" }
    this.codeContainer = createRef()
  }

  async componentDidMount() {
    const exampleName = this.props.example

    const example = await import(`@site/src/examples/${exampleName}`)
      .catch((reason) => console.log(`Could not fetch example: ${exampleName}: `, reason))

    const rawText = await import(`!html-loader!@site/src/examples/${exampleName}/code.html`)
      .then((module: NodeModule) => module["default"])
      .catch((reason) => console.log(`Could not fetch example text: ${exampleName}: `, reason))

    const exampleText = Prism.highlight(rawText, Prism.languages.closet, "closet")
      .replace(/&lt;/gu, "<")
      .replace(/\n/gu, "")

    console.log(exampleText)
    this.setState({ exampleText })


    // const setups = await Promise.all(example.setups
    //   .map((setupName: string) => import(`@site/src/setups/${setupName}`))
    // )

    // const setupCode = await Promise.all(example.setups
    //   .map((setupName: string) => import(`!raw-loader!@site/src/setups/${setupName}/setup`))
    // )
    //   .then(setups => setups.map(setup => setup["default"]))

  }

  componentWillUnmount() {
    this.setState = (state, callback) => {}
  }

  render() {
    return (
      <pre>
        <code
          className="language-closet"
          ref={this.codeContainer}
          dangerouslySetInnerHTML={{__html: this.state.exampleText}}
        ></code>
      </pre>
    )
  }

}

export default CodeDisplay;
