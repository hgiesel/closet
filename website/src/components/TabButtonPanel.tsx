import React, { KeyboardEvent, MouseEvent, useState, useEffect } from "react";

import "@site/src/css/TabButtonPanel.css";

type TabButtonPanelProps = {
  onSelected: (value: string, indexChanged: boolean) => void,
  defaultValue: string,
  values: {
    value: string,
    label: string,
  }[],
}

const keys ={
  ArrowLeft: 37,
  ArrowRight: 39,
}

const TabButtonPanel = (props: TabButtonPanelProps) => {
  const { defaultValue, values, onSelected }= props;
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => onSelected(selectedValue, true), [])

  const tabRefs: (HTMLLIElement | null)[] = [];

  const activateTabValue = (tabValue: string): void => {
    onSelected(tabValue, tabValue !== selectedValue)
    setSelectedValue(tabValue);
  };

  const activationHighlightClass = "tabs__item--activated";

  const activateTab = (tab: HTMLLIElement): void => {
    const tabIndex = tabRefs.indexOf(tab);
    const tabValue = values[tabIndex].value;
    tab.classList.add(activationHighlightClass);
    setTimeout(() => tab.classList.remove(activationHighlightClass), 100)
    activateTabValue(tabValue);
  };

  const handleTabChange = (event: MouseEvent<HTMLLIElement>): void => {
    const selectedButton = event.target as HTMLLIElement;
    activateTab(selectedButton);
  };

  const handleKeydown = (event: KeyboardEvent<HTMLLIElement>): void => {
    const eventTarget = event.target as HTMLLIElement;
    const tabIndex = tabRefs.indexOf(eventTarget);

    let focusElement: HTMLLIElement;

    switch (event.keyCode) {
      case keys.ArrowLeft:
        const nextTab = tabIndex + 1;
        focusElement = tabRefs[nextTab] || tabRefs[0];
        break;
      case keys.ArrowRight:
        const prevTab = tabIndex - 1;
        focusElement = tabRefs[prevTab] || tabRefs[tabRefs.length - 1];
        break;
      default:
        break;
    }

    if (focusElement) {
      focusElement.focus()
      activateTab(focusElement)
    }
  };

  return (
    <div className="tabs-container">
      <ul
        role="tablist"
        aria-orientation="horizontal"
        className={"tabs tabs--block"}
      >
        {values.map(({value, label}) => (
          <li
            role="tab"
            tabIndex={selectedValue === value ? 0 : -1}
            aria-selected={selectedValue === value}
            className={"tabs__item" + (selectedValue === value ? " tabs__item--active" : "")}
            key={value}
            ref={(tabControl) => tabRefs.push(tabControl)}
            onKeyDown={handleKeydown}
            onClick={handleTabChange}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TabButtonPanel
