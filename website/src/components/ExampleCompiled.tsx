import React, { PureComponent, RefObject } from "react"
import { useAsync } from "react-use"

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import "@site/src/css/ExampleCompiled.css"


const setupPattern = /^.*\}/gsu
const prepareSetupCode = (moduleCode: string): string => {
  const match = moduleCode.match(setupPattern)

  if (!match) {
    throw new Error(`Module has invalid formatting: ${moduleCode}`)
  }

  return match[0]
}

//     const setupCode = await Promise.all(example.setups
//       .map((setupName: string) => import(`!raw-loader!@site/src/setups/${setupName}/setup`))
//     )
//       .then(setups => setups.map(setup => setup["default"]))


type ExampleCompiledProps = { setups: string[], preset: string }

const ExampleCompiled = ({ setups, preset }: ExampleCompiledProps) => {
  const { loading, value = [] } = useAsync(async () => Promise.all(
    setups.map((name: string) => import(`@site/src/setups/${name}`))
  ), setups)

  return (
    <pre>
      {loading ? "...waiting..." : `loaded: ${value}` }
    </pre>
  )

// <Tabs
//   defaultValue="f1"
//   values={[
//     { label: "Front 1 and foo", value: "f1" },
//     { label: "Front 2", value: "f2" },
//     { label: "Front 3", value: "f3" },
// ]}>
//   <TabItem value="f1">
//     <pre>
//       Heyo
//     </pre>
//   </TabItem>
//   <TabItem value="f2">
//     <pre>
//       Heyo!
//     </pre>
//   </TabItem>
// </Tabs>

}

export default ExampleCompiled;
