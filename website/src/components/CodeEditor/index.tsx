import React, { useState, useEffect, useRef } from "react";

import type { Setup } from "../../setups";
import type { ContextData } from "../../contexts";

import { indexBy, prop } from "ramda";

import { closet } from "closetjs";

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Input from "@material-ui/core/Input";

import TextField from "@material-ui/core/TextField";

import ContextControls from "../ContextControls";
import SetupDrawer from "../SetupDrawer";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./styles.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00ba97",
    },
    secondary: {
      main: "#ff934f",
    },
  },
});

const prepareRenderer = (setups: Setup[], context: ContextData) => {
  let filterManager = closet.FilterManager.make(context);

  for (const setup of setups) {
    setup(closet as any, filterManager);
  }

  return (text: string, target: HTMLElement): void => {
    try {
      closet.template.Template.make(text).render(filterManager, ([result]) => {
        target.innerHTML = result;
      });
    } catch (e) {
      // TODO notify invalid template
    }
  };
};

interface CodeEditorProps {
  initialText: string;
}

const CodeEditor = (props: CodeEditorProps) => {
  const [text, setText] = useState("");
  const [setups, setSetups] = useState([]);
  const [context, setContext] = useState({ cardNumber: 1, side: "front" });

  const renderContainer = useRef();

  useEffect(() => {
    const renderer = prepareRenderer(setups, context);
    renderer(text, renderContainer.current);
  }, [text, setups, context]);

  return (
    <>
      <CodeMirror
        value={props.initialText}
        onChange={(_editor, _data, value) => setText(value)}
      />

      <MuiThemeProvider theme={theme}>
        <FormGroup row={true}>
          <Button variant="contained" color="primary" onClick={console.log}>
            Render
          </Button>

          <FormControlLabel
            control={
              <Switch
                onChange={console.log}
                color="secondary"
                name="checkedB"
              />
            }
            label="Reuse Memory"
          />

          <SetupDrawer
            initialSetups={[]}
            onSetupsChanged={(setups) =>
              setSetups(setups.map((setupInfo) => setupInfo.setup))
            }
          />

          <ContextControls
            onContextChange={(cardNumber, isBack) =>
              setContext({ cardNumber, side: isBack ? "back" : "front" })
            }
          />

          <Button variant="contained" color="primary" onClick={console.log}>
            Copy as link
          </Button>
        </FormGroup>
      </MuiThemeProvider>

      <div ref={renderContainer}></div>
    </>
  );
};

export default CodeEditor;
