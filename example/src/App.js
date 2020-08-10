import React from 'react'


import {jet, css, Form, Range, Slider, Switch, Control, Button, Field, useState } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

window.jet = jet

css.define({
  "Switch":"Switcher",
})


function TestForm() {
  return (
    <Form
      rawput={{ fullname:"Adam", age:0 }}
      output={{ fullname:"Boris", age:30 }}
      input={{ fullname:"Cyril", age:60 }}
      labels={{fullname:"Name", age:"Age", gender:"Gender"}}
      onOutput={(...args)=>{console.log("form_output", ...args)}}
      onInput={(...args)=>{console.log("form_input", ...args)}}
      onChange={(...args)=>{console.log("form_change", ...args);}}
    >
    <Field input={"Denis"} name="fullname" maxLength={15}/>
    <Range input={100} name="age" step={1} to={100}/>
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
      <Button onSubmit={console.log}>Test</Button>
    </div>
  );
}

export default App
