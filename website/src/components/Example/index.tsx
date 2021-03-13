import type { ExampleInfo } from "../../examples";

import React from "react";
import { useAsync } from "react-use";
import { TiPlus, TiEquals } from "react-icons/ti";

import ExampleSyntax from "../ExampleSyntax";
import ExampleCompiled from "../ExampleCompiled";

import styles from "./styles.module.css";

const fetchExampleText = async (name: string): Promise<string> => {
  const module = await import(
    `!raw-loader!@site/src/examples/${name}/text.html`
  );
  return module["default"];
};

const fetchExample = async (name: string): Promise<ExampleInfo> => {
  return import(`@site/src/examples/${name}`);
};

type CodeDisplayProps = { name: string };

const CodeDisplay = ({ name }: CodeDisplayProps) => {
  const exampleText = useAsync(async () => fetchExampleText(name), [name]);
  const example = useAsync(async () => fetchExample(name), [name]);

  return (
    <div className={styles.example}>
      {exampleText.loading ? (
        <pre className={styles["pre-top"]}></pre>
      ) : (
        <ExampleSyntax text={exampleText.value} className={styles["pre-top"]} />
      )}
      <TiPlus className={styles["icon-plus"]} />
      {example.loading || exampleText.loading ? (
        <pre className={styles["pre-bottom"]}></pre>
      ) : (
        <>
          <TiEquals className={styles["icon-equals"]} />
          <ExampleCompiled
            text={exampleText.value}
            setups={example.value.setups.map((setup) => setup.setup)}
            context={example.value.context}
            className={styles["pre-bottom"]}
          />
        </>
      )}
    </div>
  );
};

export default CodeDisplay;
