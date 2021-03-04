import React from "react"

import { UnControlled as CodeMirror } from 'react-codemirror2'

import "codemirror/lib/codemirror.css"
import "./styles.css"

const CodeEditor = () => {

  return (
    <CodeMirror
      value={"...your content here..."}
      onChange={(editor, data, value) => {
        console.log(editor, data, value)
      }}
    />
  )
}

export default CodeEditor;
