import React from "react"

import { UnControlled as CodeMirror } from 'react-codemirror2'

import "codemirror/lib/codemirror.css"

const CodeEditor = () => {

  return (
    <CodeMirror
      value={"<h1>I ♥ react-codemirror2</h1>"}
      onChange={(editor, data, value) => {
      }}
    />
  )
}


export default CodeEditor;
