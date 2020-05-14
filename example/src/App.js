import React, { useState, useEffect } from 'react'


import { ClassNames, Form, Input, Track, Switch, Field, Label, Pin } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

ClassNames.redefine({
  "on":"switch-on",
  "off":"switch-off"
})

function App() {

  return (
    <Form>
      <Field autoSize value={"TEST"}/>
      <Input/>
      <Track/>
      <Switch/>
      <Label/>
      <Pin/>
    </Form>
  )
}

export default App
