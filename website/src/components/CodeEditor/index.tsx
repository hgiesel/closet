import React from "react"

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

const CodeEditor = () => {

  return (
    <>
      <CodeMirror
        value={"...your content here..."}
        onChange={(editor, data, value) => {
          console.log(editor, data, value)
        }}
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

      <SetupDrawer onSetupsChanged={console.log} />

      <Button
        variant="contained"
        color="primary"
        onClick={console.log}
      >
        Copy as link
      </Button>
    </FormGroup>
    </MuiThemeProvider>
  </>
  )
}

export default CodeEditor;
