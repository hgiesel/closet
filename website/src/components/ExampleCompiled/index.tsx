import type { ContextInfo, Context } from "../../contexts";
import type { Setup } from "../../setups";

import React, { useRef } from "react";

import { indexBy, prop } from "ramda";

import TabButtonPanel from "../TabButtonPanel";

import "./styles.css";

import { closet } from "closetjs";
import "@site/node_modules/closetjs/dist/closet.css";

const prepareRenderer = (
  text: string,
  setups: Setup[],
  contextData: Context[],
) => {
  let filterManager = closet.FilterManager.make();

  for (const setup of setups) {
    setup(closet as any, filterManager);
  }

  const contexts = indexBy(prop("value"), contextData);

  return (value: string, indexChanged: boolean, target: HTMLElement): void => {
    const newContext = contexts[value].data;
    filterManager.switchPreset(newContext);

    closet.template.Template.make(text).render(filterManager, ([result]) => {
      target.innerHTML = result;
    });
  };
};

interface ExampleCompiledProps {
  text: string;
  setups: Setup[];
  context: ContextInfo;
  className: string;
}

const ExampleCompiled = ({
  text,
  setups,
  context,
  className = "",
}: ExampleCompiledProps) => {
  const renderContainer = useRef();
  const renderer = prepareRenderer(text, setups, context.values);

  return (
    <div className={"code-compiled"}>
      <TabButtonPanel
        defaultValue={context.defaultValue}
        values={context.values}
        onSelected={(value, indexChanged) =>
          renderer(value, indexChanged, renderContainer.current)
        }
      />
      <pre className={className} ref={renderContainer}></pre>
    </div>
  );
};

export default ExampleCompiled;
