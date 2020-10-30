import React from 'react'


import {jet, css, Form, Range, Slider, Switch, Control, Button, Field, Table, Trigger, Pane, Menu, useState } from '@randajan/react-form';

import "@randajan/react-form/dist/index.css";

window.jet = jet

css.define({
  "Switch":"Switcher",
})

function TestForm2() {
  return (
    <Form>
    <div className="flex scope">
      <h3>Rozsah vašeho IT systému</h3>
      <Field name="c_user" type="number"/>
      <Field name="c_pc" type="number"/>
      <Field name="c_netgear" type="number"/>
      <Field name="c_gear" type="number"/>
      <Field name="c_server" type="number"/>
      <Field name="c_service" type="number"/>
      <Field name="c_services_user" type="number"/>
    </div>
    <div className="flex range">
      <h3>Kdy nás potřebujete?</h3>
      <Range name="r_workday" from={0} to={2} step={1}>8:00 - 17:00</Range>
      <Range name="r_weekend" from={0} to={3} step={1}/>
    </div>
    <div className="flex speed">
      <h3>Rychlost naší reakce</h3>
      <Range name="g_repair" from={48} to={12} step={6}/>
      <Range name="g_urgent" from={8} to={2} step={2}/>
    </div>
  </Form>
  )
}


function TestForm() {
  return (
    <Form
      flags={{focus:p=>p.getFocus()}}
      rawput={{ fullname:"Adam", age:0 }}
      output={{ fullname:"Boris", age:30 }}
      labels={{fullname:"Name", age:"Age", gender:"Gender"}}
      onOutputDirty={(...args)=>{console.log("form_output", ...args)}}
      onInputDirty={(...args)=>{console.log("form_input", ...args)}}
      onChange={(...args)=>{console.log("form_change", ...args);}}
    >
      <Field input={"Denis"} name="fullname" maxLength={15} onInput={console.log}/>
      <Field input={100} name="age" type="number" onInput={console.log}/>
      {/* <Range input={100} name="age" step={1} from={110} to={10}/> */}
      <Switch name="gender" onOutput={(s,v)=>console.log("output", v)} onInput={(s,v)=>console.log("input", v)}/>
      <div>
        <Button type="reset">To Default</Button>
        <Button type="reject">Undo changes</Button>
        <Button type="submit">Submit</Button>
      </div>
    

    </Form>

  )
}

function App() {
  const [ state, setState ] = useState(false);

  return (
    <div className={jet.str.to(["App", state?"open":"close"], " ")}>
      <TestForm/>
      <div onClick={_=>setState(true)}>CLICK ME</div>
      {state ? <TestForm2/> : null}
      <Button onSubmit={console.log}>Test</Button>
      <Table columns={["Baby", "Heyby"]} rows={[[1, "a"], [2, "b"]]}/>
      <Slider from={10} to={0} step={1} onInput={console.log}/>

      <Menu trigger={"Menu"} noblur transition={600}>
        <div>Cool</div>
        <div>I want it</div>
        <Menu trigger={"SubMenu"} noblur transition={600}>
          <div>Cool</div>
          <div>I want it</div>
          <div>Oh my gosh</div>
          <div>I will pay you money</div>
        </Menu>
        <div>Oh my gosh</div>
        <div>I will pay you money</div>
      </Menu>
    </div>
  );
}

export default App
