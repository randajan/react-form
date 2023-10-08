import React, { Component, useRef } from 'react'

import jet from "@randajan/jet-core";
import ModalProvider, { PopUp, Bar, Form, Range, Slider, Switch, Button, Field, cssTranslate } from "../../dist/index.js";
import "../../dist/index.css";
import starPng from "./star.png";


cssTranslate(cn=>{
  console.log(cn);
  return cn;
});


function TestForm2() {
  //const onInput = useForceRender();
  const ref = useRef();
  const form = ref.current;
  const input = form ? jet.map.of(form.getInput(), jet.num.to) : {};

  return (
    <Form { ...{ref }}>
      <div className="flex scope">
        <h3>Rozsah vašeho IT systému</h3>
        <Switch name="is_detailed"/>
        <Field name="c_user" type="number"/>
        <Field name="c_server" type="number"/>
        {/* <Pane key={10} expand={!!input.is_detailed} transition={20000}>
          <Field name="c_pc" type="number"/>
          <Field name="c_netgear" type="number"/>
          <Field name="c_gear" type="number"/>
        </Pane> */}

      </div>
    </Form>
  )
}


function Star() {
  return <img src={starPng}/>;
}

function FiveStar() {
  return (<div className="FiveStar"><Star/><Star/><Star/><Star/><Star/></div>);
}

function TestForm() {
  return (
    <Form
      flags={{focus:p=>p.getFocus()}}
      rawput={{ fullname:"Adam", age:0 }}
      output={{ fullname:"Boris", age:30 }}
      labels={{fullname:"Name", age:"Age", gender:"Gender", bio:"Bio"}}
      onOutputDirty={(...args)=>{console.log("form_output", ...args)}}
      onInputDirty={(...args)=>{console.log("form_input", ...args)}}
      onChange={(...args)=>{console.log("form_change", ...args);}}
    >
      <PopUp>Hello</PopUp>
      <Field input={"Denis"} name="fullname" maxLength={15} onInput={console.log} focus/>
      {/* <Field input={100} name="age" type="number" onInput={console.log}/> */}
      <Range input={100} name="age" step={5} from={0} to={100} marker={<FiveStar/>}/>
      <Switch name="gender" onOutput={(s,v)=>console.log("output", v)} onInput={(s,v)=>console.log("input", v)}/>
      <Field name="bio" maxLength={255} type="textarea" autoSize/>
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
    <ModalProvider className="App">
      <TestForm/>
      <Button onSubmit={console.log}>Test</Button>
      {/* <Table columns={["Baby", "Heyby"]} rows={[[1, "a"], [2, "b"]]}/> */}
      <Slider onInput={console.log}/>
      {/* <Menu trigger={"Menu"} noblur transition={600}>
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
      </Menu> */}
    </ModalProvider>
  );
}

export default App
