import React, { useState, useEffect } from 'react'


import { ClassNames, Form, Feed, Track, Switch, Field, Group, Label, Pin } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

ClassNames.redefine({
  "on":"switch-on",
  "off":"switch-off"
})

function App() {
  return (
    <Form>
      <Group fields={{hip:"Test", fuk:"Best", tap:"Chest", get:{value:"test"}}}/>
      <Track to={6} value={2} step={6}/>
      <Switch value={true} label={"Beta"}/>
      <Label/>
      <Pin/>
    </Form>
  )
}

export default App
