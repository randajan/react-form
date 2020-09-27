import React from 'react'


import {jet, css, Form, Range, Slider, Switch, Control, Button, Field, Table, Trigger, Pane, Menu } from '@randajan/react-form';

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
      labels={{fullname:"Name", age:"Age", gender:"Gender"}}
      onOutputDirty={(...args)=>{console.log("form_output", ...args)}}
      onInputDirty={(...args)=>{console.log("form_input", ...args)}}
      onChange={(...args)=>{console.log("form_change", ...args);}}
    >
    <Field input={"Denis"} name="fullname" maxLength={15} onInputDirty={console.log}/>
    <Range input={100} name="age" step={1} to={100}/>
    <Switch name="gender"/>
    <div>
      <Button type="reset">To Default</Button>
      <Button type="reject">Undo changes</Button>
      <Button type="submit">Submit</Button>
    </div>
    

    </Form>
  )
}

function App() {
  return (
    <div className="App">
      <TestForm/>
      <Button onSubmit={console.log}>Test</Button>
      <Table columns={["Baby", "Heyby"]} rows={[[1, "a"], [2, "b"]]}/>

      <Menu placeHolder={"Shit"} position={"top-right"} unmountOnExit transition={600}>
        <div>Cool</div>
        <div>I want it</div>
        <div>Oh my gosh</div>
        <div>I will pay you money</div>
      </Menu>
    </div>
  );
}

export default App
