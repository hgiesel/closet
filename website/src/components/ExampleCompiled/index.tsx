import type { ContextInfo, Context } from "../../contexts"
import type { Setup } from "../../setups"

import React, { useRef } from "react"

import { indexBy, prop } from "ramda"

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

const prepareRenderer = (
  text: string,
  setups: Setup[],
  contextData: Context[],
) => {
  let filterManager = closet.FilterManager.make()

  for (const setup of setups) {
    setup(closet as any, filterManager)
  }

  const contexts = indexBy(prop("value"), contextData)

  return (value: string, indexChanged: boolean, target: HTMLElement): void => {
    const newContext = contexts[value].data
    filterManager.switchPreset(newContext)

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
