import React, { useState, useEffect, useRef } from "react"

import type { Setup } from "../../setups";
import type { Context } from "../../contexts";

import { indexBy, prop } from "ramda"

import { closet } from "closetjs"

import { UnControlled as CodeMirror } from 'react-codemirror2'
import "codemirror/lib/codemirror.css"

import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

import SetupDrawer from "../SetupDrawer"

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./styles.css"


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00ba97",
    },
    secondary: {
      main: "#ff934f",
    }
  },
});

const prepareRenderer = (
  setups: Setup[],
  context: Context,
) => {
  let filterManager = closet.FilterManager.make(context.data)

  for (const setup of setups) {
    setup(closet as any, filterManager)
  }

  return (text: string, target: HTMLElement): void => {
    try {
    closet.template.Template
      .make(text)
      .render(filterManager, ([result]) => {
        target.innerHTML = result;
      })
    }
    catch (e) {
      // TODO notify invalid template
    }
  }
}

import * as frontBack from "../../contexts/frontBack"

interface CodeEditorProps {
  initialText: string
}

const CodeEditor = (props: CodeEditorProps) => {
  const [text, setText] = useState("")
  const [setups, setSetups] = useState([])

  const renderContainer = useRef()

  useEffect(() => {
    const renderer = prepareRenderer(setups, frontBack.values[0])
    renderer(text, renderContainer.current)
  }, [text, setups])

  return (
    <>
      <CodeMirror
        value={props.initialText}
        onChange={(_editor, _data, value) => setText(value)}
      />

    <MuiThemeProvider theme={theme}>
      <FormGroup row={true}>
        <Button
          variant="contained"
          color="primary"
          onClick={console.log}
        >
          Render
        </Button>
        <FormControlLabel
          control={
            <Switch
              onChange={console.log}
              color="secondary"
              name="checkedB"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
          label="Reuse Memory"
        />

      <SetupDrawer
        initialSetups={[]}
        onSetupsChanged={(setups) => setSetups(setups.map(setupInfo => setupInfo.setup))}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={console.log}
      >
        Copy as link
      </Button>
    </FormGroup>
    </MuiThemeProvider>

    <div ref={renderContainer}></div>
  </>
  )
}

export default CodeEditor;
