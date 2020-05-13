import React, { Component, useRef, useState, ueEffect } from 'react';
import PropTypes from 'prop-types';


import jet from "@randajan/jetpack";

import Label from "../Label/Label"

import "./Field.scss";

const FIELD_CHECKER = new Set();
setInterval(_ => {for (let field of FIELD_CHECKER) { field.check(); }}, 100);


function passProps(props, include, exclude) {
  return jet.obj.map({...props, ...include}, (v,k)=>exclude[k] === undefined ? v : undefined);
}


//FIELD
//@name
//@value
//@label
//@type
//@className
//@id
class Field_old extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  dateTypes = ["date", "time", "datetime"];
  constructor(props) {
    super(props);
    this.state = {input: "", value: "", open: false};
  }

  getBox() {
    const { box, picker } = this.refs;
    return box || (picker ? picker.refs.box : null);
  }

  setValue(value) {
    this.getBox().value = value;
    this.check();
  }

  resetValue() {
    return this.setValue(this.state.value);
  }

  focus() {
    this.getBox().focus();
  }

  blur() {
    this.getBox().blur();
  }

  eventHandler(ev) {
    const k = ev.keyCode;
    if (k === 27) { this.resetValue(); }//escape 
    else if (k !== 13) { return; }//not enter
    this.blur(); ev.preventDefault();
  }

  check(focus) {
    const box = this.getBox();
    const state = this.state;
    const { onChange, onFocus, onBlur } = this.props;

    const now = { input: box.value, open: focus == null ? state.open : focus };

    const chngFocus = state.open !== now.open; //focus change event
    const chngInput = state.input !== now.input; //input change event

    box.removeAttribute("value"); // fucking creepy disgusting workaround

    if (!chngFocus && !chngInput) { return } //no change

    if (chngFocus && now.open && onFocus && onFocus() === false) { return box.blur(); } //focus event
    if (chngFocus && !now.open && onBlur && onBlur() === false) { return box.focus(); } //blur event

    if (!now.open && state.value !== now.input) {//change event
      if (onChange && onChange(now.input, state.value) === false) { return this.resetValue(); } //cancel change
      now.value = now.input;
    }

    this.setState(now);
  }

  componentDidMount() {
    FIELD_CHECKER.add(this);
    this.setValue(this.props.value);
  }

  componentWillUnmount() {
    FIELD_CHECKER.delete(this);
  }

  render() {
    const { open, input } = this.state;
    const { id, name, className, type, label, title, rows, cols, constraints, tabIndex } = this.props;
    const { autoComplete, required } = this.props;

    const isDate = this.dateTypes.includes(type);
    const isArea = rows > 0;

    let box;
    const baseSettings = {
      ref: "box",
      name: name || type,
      type: isArea ? null : isDate ? "text" : type,
      tabIndex: tabIndex || 0,
      onKeyDown: ev => this.eventHandler(ev),
    }
    const richSettings = {
      ...baseSettings,
      onFocus: _ => this.check(true),
      onBlur: _ => this.check(false),
      onChange: _ => this.check(),
      autoComplete, required
    }

    if (isArea) {
      box = <textarea {...richSettings} rows={rows} cols={cols} />
    } else if (isDate) {

      box = <Datetime
        value={this.state.open ? "" : this.state.value}
        inputProps={{ ...baseSettings, autoComplete: "off", }}
        viewMode={type === "time" ? type : "days"}
        dateFormat={type === "time" ? false : true}
        timeFormat={type === "date" ? false : true}
        timeConstraints={constraints}
        onFocus={richSettings.onFocus}
        onBlur={richSettings.onBlur}
        onChange={richSettings.onChange}
        ref="picker"
      />
    } else {
      box = <input {...richSettings} />
    };

    return (
      <div
        title={title || label}
        id={id}
        className={jet.obj.join(["Field", type, open ? "focus" : "blur", input ? "full" : "empty", className], " ")}
      >
        <Label name={name}>{label}</Label>
        {box}
        <div className="underline"></div>
      </div>)
  }

};

//@name
//@value
//@label
//@type
//@className
//@id
function Field(props) {
  let { name, value, title, label, type, className, onChange, onBlur, onFocus, rows, cols, constraints, tabIndex, autoComplete, required } = props;
  
  const [state, setState] = useState({focus:false, output:""});
  const ref = useRef();

  [type] = jet.get([["string", type, "line"]]);
  [label, title] = jet.get([["string", label, title, type.capitalize()], ["string", title, label, type.capitalize()]]);
  [name] = jet.get([["string", name, label.simplify(), title.simplify()]]);

  [rows, cols, tabIndex] = jet.get([["number", rows, 1], ["number", cols], ["number", tabIndex]]);

  const boxProps = {
    ref,
    name,
    tabIndex,
    onKeyDown: ev => console.log(ev),
    onFocus: _ => setState({...state, focus:true}),
    onBlur: _ => {
      window.debug = ref;
      const output = jet.obj.get(ref, "current.value");
      console.log(output);
      setState({...state, focus:false, output:output});
    },
    autoComplete, required, rows, cols
  }

  const pass = passProps(
    props,
    {
      title,
      className:jet.obj.join(["Field", type, state.focus ? "focus" : "blur", state.output ? "full" : "empty", className], " ")
    }, 
    {name, value, title, label, type, onChange, onBlur, onFocus, rows, cols, constraints, tabIndex, autoComplete, required}
  );

  return (
    <div {...pass}>
      <Label name={name}>{label}</Label>
      <textarea {...boxProps} />
      <div className="underline"></div>
    </div>
  )
}

export default Field;
