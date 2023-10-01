# @randajan/react-form

> Basic react forms and fields

[![NPM](https://img.shields.io/npm/v/@randajan/react-form.svg)](https://www.npmjs.com/package/@randajan/react-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @randajan/react-form
```

## Usage

```jsx
import React from 'react'

import {ClassNames, Form, Range, Switch, Button, Field } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

ClassNames.redefine({
  "on":"switch-on",
  "off":"switch-off"
})

function TestForm() {
  return (
    <Form
      flag={{fullnameFocused:(props, state)=>state.focus==="fullname"}}
      rawput={{ fullname:"Adam", age:0 }}
      output={{ fullname:"Boris", age:30 }}
      input={{ fullname:"Cyril", age:60 }}
      labels={{fullname:"Name", age:"Age", gender:"Gender"}}
      onOutput={(...args)=>{console.log("form_output", ...args)}}
      onInput={(...args)=>{console.log("form_input", ...args)}}
      onChange={(...args)=>{console.log("form_change", ...args);}}
    >
      <Field input={"Denis"} name="fullname" maxLength={15}/>
      <Range vertical inverted input={100} name="age" step={1} to={100}/>
      <Switch name="gender"/>
      <div>
        <Button type="rejectOutput">Clear</Button>
        <Button type="rejectInput">Undo changes</Button>
        <Button type="submitInput">Submit</Button>
      </div>
    </Form>
  )
}

function App() {
  return (
    <div className="App">
      <TestForm/>
    </div>
  );
}

export default App

```

## License

MIT © [randajan](https://github.com/randajan)
