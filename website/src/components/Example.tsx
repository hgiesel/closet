import { TiPlus, TiEquals } from "react-icons/ti";

import React, { PureComponent } from "react"
import ExampleSyntax from "./ExampleSyntax"
import ExampleCompiled from "./ExampleCompiled"


import styles from "@site/src/css/Example.module.css"

type CodeDisplayProps = { name: string }
type CodeDisplayState = { rawText: string, setups: string[], preset: string }


const defaultState: CodeDisplayState = { rawText: "", setups: [], preset: "" }

class CodeDisplay extends PureComponent<CodeDisplayProps, CodeDisplayState> {
  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = defaultState;
  }

  render() {
    return (
      <div className={styles.example}>
        <ExampleSyntax text={this.state.rawText} />
        <TiPlus className={styles["icon-plus"]} />
        <TiEquals className={styles["icon-equals"]} />
        <ExampleCompiled setups={this.state.setups} preset={this.state.preset} />
      </div>
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
      { setups, preset },
    ] = await Promise.all([rawTextPromise, examplePromise])

    this.setState({ rawText, setups, preset })
  }

  componentWillUnmount() {
    this.setState = () => {}
  }
}

export default CodeDisplay;
