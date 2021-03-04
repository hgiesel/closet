import type { ContextInfo, Context } from "../../contexts"
import type { Setup } from "../../setups"

import React, { useEffect, useRef } from "react"

import TabButtonPanel  from '../TabButtonPanel';

import "./styles.css"

import { closet } from "closetjs"
import "@site/node_modules/closetjs/dist/closet.css"

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

const prepareRenderer = (
  text: string,
  setups: Setup[],
  contextData: any,
) => {
  const filterManager = closet.FilterManager.make()

  for (const setup of setups) {
    setup(closet as any, filterManager)
  }

  return (value: string, indexChanged: boolean, target: HTMLElement): void => {
    console.log(contextData)

    closet.template.Template
      .make(text)
      .render(filterManager, ([result]) => {
        target.innerHTML = result;
      })
  }
}

type ExampleCompiledProps = { text: string, setups: Setup[], context: ContextInfo }

const ExampleCompiled = ({ text, setups, context }: ExampleCompiledProps) => {
  const renderContainer = useRef()
  const renderer = prepareRenderer(text, setups, context.values)

  return (
      <div className={"code-compiled"}>
        <TabButtonPanel
          defaultValue={context.defaultValue}
          values={context.values}
          onSelected={(value, indexChanged) => renderer(value, indexChanged, renderContainer.current)}
        />
        <pre ref={renderContainer}></pre>
      </div>
  )
}


export default ExampleCompiled;
