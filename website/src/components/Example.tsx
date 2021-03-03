import React, { PureComponent, Suspense } from "react"
import ExampleSyntax from "./ExampleSyntax"
import Prism from "prismjs"

import * as closet from "closetjs"

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

type CodeDisplayProps = { name: string }
type CodeDisplayState = { rawText: string }

const defaultState: CodeDisplayState = { rawText: "" }

class CodeDisplay extends PureComponent<CodeDisplayProps, CodeDisplayState> {
  constructor(props: CodeDisplayProps) {
    super(props)
    const exampleName = this.props.name

    import(`!raw-loader!@site/src/examples/${exampleName}/text.html`)
      .then((module: NodeModule) => module["default"])
      .then((rawText: string) => this.setState({ rawText }))
      .catch((reason) => console.log(`Could not fetch example text: ${exampleName}: `, reason))

    this.state = defaultState;
  }

  // async componentDidMount() {
  //   const exampleName = this.props.name

  //   const example = await import(`@site/src/examples/${exampleName}`)
  //     .catch((reason) => console.log(`Could not fetch example: ${exampleName}: `, reason))

//     const setups = await Promise.all(example.setups
//       .map((setupName: string) => import(`@site/src/setups/${setupName}`))
//     )

//     const setupCode = await Promise.all(example.setups
//       .map((setupName: string) => import(`!raw-loader!@site/src/setups/${setupName}/setup`))
//     )
//       .then(setups => setups.map(setup => setup["default"]))

    // this.setState({ rawText })
  // }

  render() {
    return (
      <>
        <ExampleSyntax text={this.state.rawText}/>
      </>
    )
  }

  componentWillUnmount() {
    this.setState = () => {}
  }
}

export default CodeDisplay;
