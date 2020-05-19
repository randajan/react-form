import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper" 

import Field from "../Field/Field";
import Switch from "../Track/Switch";
import Track from "../Track/Track";

import css from "./Form.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

function retrieveStr(val, key, def) {
  return (jet.is("object", val) ? val[key] : jet.str.to(val, key)) || def;
}

class Form extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onOutput: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: ()=>{},
    onBlur: ()=>{},
    onFocus: ()=>{},
    onOutput: ()=>{},
  }

  constructor(props) {
    super(props);
    this.state = {
      focus:false,
      output:{}
    }
  }

  submit() { this.setState({submited:true}); }
  getOutput() { return this.state.output; }

  async setState(state, ele) {
    const { onSubmit, onOutput, onFocus, onBlur, onChange } = this.props;
    const { focus, output, submited } = this.state;
    
    const now = {...this.state, ...jet.get("object", state)};
    const changes = [];

    if (now.focus !== focus) {
      if (now.focus) { onFocus(this, true); }
      else { onBlur(this, false); }
      changes.push("focus");
    }
    if (ele && jet.str.to(output[ele.props.name]) != ele.state.output) {
      onOutput(this);
      output[ele.props.name] = ele.state.output;
      now.submited = false;
      now.output = output;
      changes.push("output");
    }
    if (now.submited !== submited) {
      if (now.submited) { onSubmit(this, output); }
      changes.push("submited");
    }
    if (changes.length) {
      super.setState(now);
      jet.run(onChange, this, changes);
    }
  }

  fetchSelfProps() {
    const { name, className, values, labels, titles, readOnly, onOutput, onBlur, onFocus, onChange } = this.props;
    const { focus, submited } = this.state;

    return Proper.pass(this.props, {
      className:CN.get(["Form", focus?"focus":"blur", submited?"submited":"dirty", className]),
      onSubmit:ev=>{this.submit(); jet.event.stop(ev);},
    }, { name, values, labels, titles, readOnly, onOutput, onBlur, onFocus, onChange });
  }

  fetchInjectProps(ele, key, level) {
    const { values, labels, titles, readOnly } = this.props;
    const { value, label, title, onChange } = ele.props;
    
    const name = jet.get("string", ele.props.name, level+"-"+key);
    return {
      name, readOnly, ref:name,
      value: retrieveStr(values, name, value),
      label: retrieveStr(labels, name, label),
      title: retrieveStr(titles, name, title),
      onChange:[onChange, (ele, changes)=>{
        const focus = ele.state.focus;
        if (changes.includes("focus") || changes.includes("output")) { this.setState({focus}, ele); }
      }]
    }
  }

  render() {
    const { children } = this.props;
    return (
      <form {...this.fetchSelfProps()}>
        {Proper.inject(children, this.fetchInjectProps.bind(this), [ Field, Switch, Track ], true)}
      </form>
    )
  }
}


export default Form;




