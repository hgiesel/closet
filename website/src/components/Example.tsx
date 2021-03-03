import ArrowDownwardIcon from '@material-ui/icons/ArrowDownwardRounded';

import React, { PureComponent } from "react"
import ExampleSyntax from "./ExampleSyntax"
import ExampleCompiled from "./ExampleCompiled"


import styles from "@site/src/css/Example.module.css"

type CodeDisplayProps = { name: string }
type CodeDisplayState = { rawText: string, setups: string[] }


const defaultState: CodeDisplayState = { rawText: "", setups: [] }

class CodeDisplay extends PureComponent<CodeDisplayProps, CodeDisplayState> {
  constructor(props: CodeDisplayProps) {
    super(props)
    this.state = defaultState;
  }

  render() {
    console.log(styles)
    return (
      <div className={styles.example}>
        <ExampleSyntax text={this.state.rawText} />
        <ArrowDownwardIcon className={styles['down-arrow']} />
        <ExampleCompiled setups={this.state.setups} />
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
      { setups },
    ] = await Promise.all([rawTextPromise, examplePromise])

    this.setState({ rawText, setups })
  }

  componentWillUnmount() {
    this.setState = () => {}
  }
}

export default CodeDisplay;
