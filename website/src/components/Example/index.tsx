import type { ExampleInfo } from "../../examples"

import React from "react"
import { useAsync } from "react-use"
import { TiPlus, TiEquals } from "react-icons/ti";

import ExampleSyntax from "../ExampleSyntax"
import ExampleCompiled from "../ExampleCompiled"

import styles from "./styles.module.css"


const fetchExampleText = async (name: string): Promise<string> => {
  const module = await import(`!raw-loader!@site/src/examples/${name}/text.html`)
  return module["default"]
}

const fetchExample = async (name: string): Promise<ExampleInfo> => {
  return import(`@site/src/examples/${name}`)
}

type CodeDisplayProps = { name: string }

const CodeDisplay2 = ({ name }: CodeDisplayProps) => {
  const exampleText = useAsync(async () => fetchExampleText(name), [name])
  const example = useAsync(async () => fetchExample(name), [name])

  return (
    <div className={styles.example}>
      {exampleText.loading
        ? <pre></pre>
        : <ExampleSyntax text={exampleText.value} />
      }
      <TiPlus className={styles["icon-plus"]} />
      <TiEquals className={styles["icon-equals"]} />
      {example.loading || exampleText.loading
        ? <pre></pre>
        : <ExampleCompiled
          text={exampleText.value}
          setups={example.value.setups.map(setup => setup.setup)}
          context={example.value.context}
        />
      }
    </div>
  )
}

export default CodeDisplay2;
