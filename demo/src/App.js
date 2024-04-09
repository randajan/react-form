import React, { Component, useEffect, useRef, useState } from 'react'

import jet from "@randajan/jet-core";
import ModalProvider, { Table, Menu, PopUp, Bar, Form, Range, Slider, Switch, Button, Field, cssTranslate, Block, Caption, Article } from "../../dist/index.js";
import "../../dist/index.css";
import starPng from "./star.png";

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
      rawput={{ fullname:"Adam", age:0, gender:false }}
      output={{ fullname:"Boris", age:30, gender:false }}
      labels={{ fullname:"Name", age:"Age", gender:"Gender", bio:"Bio" }}
      onSubmit={form=>{ return false; }}
      // onOutput={(...args)=>{console.log("form_output", ...args)}}
      // onInput={(...args)=>{console.log("form_input", ...args)}}
      // onChange={(...args)=>{console.log("form_change", ...args);}}
    >
      <Field input={"Denis"} name="fullname" maxLength={15} onInput={console.log}/>
      <Field input={100} name="age" type="number" onInput={console.log} focus step={5} min={10} max={150}/>
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

function RndField() {
  const [rndval, setRndval] = useState("test");

  useEffect(_=>{ let id = setInterval(_=>setRndval(String.jet.rnd(5)), 5000); return _=>clearInterval(id); });
  console.log(rndval);
  return <Field name={"test"} rawput={rndval} autoSize/>;
}

function App() {
  const [sw, setSw] = useState(undefined);


  return (
    <ModalProvider className="App" caption="H1">
      <Article src={"# AAAA <br> ![hello](https://upload.wikimedia.org/wikipedia/commons/5/5a/Wikipedia%27s_W.svg)"}/>
      {/* <RndField/> */}
      <TestForm/>
      <Button onSubmit={_=>setSw(!sw)}>Switch menu</Button>
      <Table columns={["Baby", "Heyby"]} rows={[[1, "a"], [2, "b"]]}/>
      <Slider onInput={console.log}/>
      <Block caption="WTF"><Block caption="WTF2">Hello</Block></Block>
      <PopUp caption="TEST caption"></PopUp>
      <Menu trigger={"Menu"} transition={600} noblur>
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
      aaaaa
    </ModalProvider>
  );
}

export default App
