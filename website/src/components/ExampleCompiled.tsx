import React, { PureComponent } from "react"


const setupPattern = /^.*\}/gsu
const prepareSetupCode = (moduleCode: string): string => {
  const match = moduleCode.match(setupPattern)

  if (!match) {
    throw new Error(`Module has invalid formatting: ${moduleCode}`)
  }

  return match[0]
}

type ExampleCompiledProps = { setups: string[] }
type ExampleCompiledState = { highlightedText: string }

const defaultState = { highlightedText: "" }

class ExampleCompiled extends PureComponent<ExampleCompiledProps, ExampleCompiledState> {
  codeContainer: RefObject<HTMLElement>

  constructor(props: ExampleCompiledProps) {
    super(props)
    this.state = defaultState
  }

  componentDidMount() {}
//     const setups = await Promise.all(example.setups
//       .map((setupName: string) => import(`@site/src/setups/${setupName}`))
//     )

//     const setupCode = await Promise.all(example.setups
//       .map((setupName: string) => import(`!raw-loader!@site/src/setups/${setupName}/setup`))
//     )
//       .then(setups => setups.map(setup => setup["default"]))

  static getDerivedStateFromProps(props: ExampleCompiledProps): ExampleCompiledState {
    return null
  }

  render() {
    return (
      <pre>
        Heyo
      </pre>
    )
  }

}

export default ExampleCompiled;
