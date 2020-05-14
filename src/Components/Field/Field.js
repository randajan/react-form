import React, { useState, useRef } from 'react';


import jet from "@randajan/jetpack";

import Label from "../Label/Label";
import Input from "../Input/Input";

import Proper from "../../Helpers/Proper" 

import css from "./Field.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


function Field(props) {
  const [state, setState] = useState({});
  let {id, type, name, label, title, className, onChange} = props;
  const ref = useRef();

  [type] = jet.get([["string", type, "text"]]);
  [label, title] = jet.get([["string", label, title, type.capitalize()], ["string", title, label, type.capitalize()]]);
  [name] = jet.get([["string", name, label.simplify(), title.simplify()]]);

  const body = {
    id, title, 
    onClick:_=>ref.current.focusInput(),
    className:CN.get("Field", state.focus ? "focus" : "blur", state.output ? "full" : "empty", className),
  }

  const pass = Proper.pass(props, {
      type, name, ref,
      onChange:(state)=>{ setState(state); jet.run(onChange, state); },
      className:CN.pass("Input"),
    },{
      title
  })

  return (
    <div {...body}>
      <Label className={CN.pass("Label")} children={label}/>
      <Input {...pass}/>
      <div className={CN.get("underline")}/>
    </div>
  )
}


export default Field;
