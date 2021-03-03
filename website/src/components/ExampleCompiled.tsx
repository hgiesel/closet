import React, { PureComponent, createRef, RefObject } from "react"
import Prism from "prismjs"

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
