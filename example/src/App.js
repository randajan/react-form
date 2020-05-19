import React from 'react'


import { useState, ClassNames, Form, Track, Switch, Field, Label, Pin } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

ClassNames.redefine({
  "on":"switch-on",
  "off":"switch-off"
})

function App() {
  const [output, setOutput] = useState({});

  return (
    <Form name="user" onOutput={form=>setOutput(form.state.output)} labels={{foo:"foo2", bar:"bar2", test:"test2"}}>
      <div className={"test"}>
        Testuji
        <Field name="betatest"/>
        <Field name="betatest2"/>
      </div>
      <Field name="foo" maxLength={10} label="foo"/>
      <Field name="bar" readOnly value="xyz" label="bar"/>
      <Field/>
      <Track pins={1} value={50} label="Testuji"/>
      <Track value={0} to={1} label="test"/>
      <Switch name="switch" label="switch"/>
      <input type="submit"/>
    </Form>
  )
}

export default App
