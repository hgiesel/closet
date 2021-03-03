import type { ExampleInfo } from "../examples"

import React, { PureComponent, Suspense } from "react"
import ExampleSyntax from "./ExampleSyntax"
import ExampleCompiled from "./ExampleCompiled"

import * as closet from "closetjs"

const setupPattern = /^.*\}/gsu
const prepareSetupCode = (moduleCode: string): string => {
  const match = moduleCode.match(setupPattern)

  if (!match) {
    throw new Error(`Module has invalid formatting: ${moduleCode}`)
  }

  return match[0]
}

type CodeDisplayProps = { name: string }
type CodeDisplayState = { rawText: string, setups: string[] }


const defaultState: CodeDisplayState = { rawText: "", setups: [] }

class CodeDisplay extends PureComponent<CodeDisplayProps, CodeDisplayState> {
  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = defaultState;
  }

  render() {
    return (
      <>
        <ExampleCompiled setups={this.state.setups} />
        <ExampleSyntax text={this.state.rawText}/>
      </>
    )
  }

  async componentDidMount() {
    const exampleName = this.props.name

    const rawTextPromise = import(`!raw-loader!@site/src/examples/${exampleName}/text.html`)
      .then((module: NodeModule) => module["default"])
      .catch((reason) => console.log(`Could not fetch example text: ${exampleName}: `, reason))

    const examplePromise = await import(`@site/src/examples/${exampleName}`)
      .catch((reason) => console.log(`Could not fetch example: ${exampleName}: `, reason))

    const [
      rawText,
      { setups },
    ] = await Promise.all([rawTextPromise, examplePromise])

    this.setState({ rawText, setups })
  }

  componentWillUnmount() {
    this.setState = () => {}
  }
}

export default CodeDisplay;
