import React, { useEffect, useRef } from "react"
import { useAsync } from "react-use"

import TabButtonPanel, { SelectedHandler } from '../TabButtonPanel';

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
  setups: any[],
  contextData: Record<string, Record<string, unknown>>,
  target: HTMLElement,
): SelectedHandler => {
  const filterManager = closet.FilterManager.make()

  for (const setup of setups) {
    setup.setup(closet, filterManager)
  }

  return (value: string, indexChanged: boolean): void => {
    closet.template.BrowserTemplate
      .makeFromNode(target)
      .render(filterManager)
  }
}

type ExampleCompiledProps = { text: string, setupNames: string[], presetName: string }

const ExampleCompiled = ({ text, setupNames, presetName }: ExampleCompiledProps) => {
  const renderContainer = useRef()

  console.log(setupNames, presetName)

  const setupsPromise = Promise.all(
    setupNames.map((name: string) => import(`@site/src/setups/${name}`))
  )
  const contextPromise = import(`@site/src/contexts/${presetName}`)

  let renderer: SelectedHandler = null;
  let contexts = null;

  useEffect(() => {
    Promise.all([setupsPromise, contextPromise])
      .then(([setups, context]) => {
        console.log('hey', context, setups)
        renderer = prepareRenderer(text, setups.value, context.value.values, renderContainer.current)
      })
  }, [])

  return (
      <div className={"code-compiled"}>
        {renderer && contexts
          ? (
            <TabButtonPanel
              defaultValue={contexts.defaultValue}
              values={contexts.values}
              onSelected={renderer}
            />
          )
          : <></>
        }
        <pre ref={renderContainer}></pre>
      </div>
  )
}


export default ExampleCompiled;
