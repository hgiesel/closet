import React, { PureComponent, RefObject } from "react"
import { useAsync } from "react-use"

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import "@site/src/css/ExampleCompiled.css"

import * as closet from "closetjs"
import "../../../node_modules/closetjs/dist"

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

const prepare = (text: string, setups: any[], preset: Record<string, unknown>) => {
  const filterManager = closet.FilterManager.make()

  for (const setup of setups) {
    setup.setup(closet, filterManager, preset)
  }

  const output = closet.template.Template
    .make(text)
    .render(filterManager)

  return output[0]
}

type ExampleCompiledProps = { text: string, setupNames: string[], presetName: string }

const ExampleCompiled = ({ text, setupNames, presetName }: ExampleCompiledProps) => {

  const setups = useAsync(async () => Promise.all(
    setupNames.map((name: string) => import(`@site/src/setups/${name}`))
  ), [setupNames])

  const preset = useAsync(async () => import(`@site/src/presets/${presetName}`), [presetName])

  const rendered = setups.value && preset.value
    ? prepare(text, setups.value, preset.value)
    : "..."

  return preset.value
    ? (
      <Tabs
        defaultValue={preset.value.defaultValue}
        values={preset.value.values}
      >
        {preset.value.values.map(({ value }) => (
          <TabItem key={value} value={value}>
            <pre dangerouslySetInnerHTML={{ __html: rendered }}>
            </pre>
          </TabItem>
        ))}
      </Tabs>
    )
    : <></>
}


export default ExampleCompiled;
