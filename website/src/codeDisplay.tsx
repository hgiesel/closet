import React, { Component } from "react";


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
  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = { setupCode: "" }
  }

  async componentDidMount() {
    const file = `${this.props.setupName}.js`

    try {
      const setupAsString = await import(`!raw-loader!./setups/${file}`)
      const setup = await import(`./setups/${file}`)

      const setupCode = getSetupCode(setupAsString.default)
      this.setState({ setupCode })
    }
    catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {}
  }

  render() {
    return (
      <pre><code className="language-javascript">{this.state.setupCode}</code></pre>
    );
  }
}

export default CodeDisplay;
