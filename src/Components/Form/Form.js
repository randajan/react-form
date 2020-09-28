import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Flagable from '../../Dummy/Flagable';

import Button from "../Button/Button";

import Field from "../Field/Field";
import Switch from "../Switch/Switch";
import Range from "../Range/Range";

import cssfile from "./Form.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);


class Form extends Flagable {

  static className = "Form";

  static childs = [Field, Switch, Range, Button];
  static passEvents = [ "onInput", "onOutput", "onRawput" ];
  static bubblingEvents = [ "onFocus", "onBlur", "onInputDirty", "onOutputDirty" ];

  static propTypes = {
    ...Flagable.propTypes,
    rawput:PropTypes.object,
    output:PropTypes.object,
    input:PropTypes.object
  }

  static defaultProps = {
    ...Flagable.defaultProps,
    rawput:{},
    output:{},
    input:{}
  }

  static fetchName(name, key, level) {
    return jet.get("string", name, jet.num.toLetter(level)+key);
  }

  static fetchValue(val, key, def) {
    val = (jet.is("object", val) ? val[key] : jet.is("function", val) ? val(key) : val);
    return val !== undefined ? val : def;
  }

  fields = {};

  constructor(props) {
    super(props);
    let rendermod = true;
    this.rerender = mod=>{
      if (mod !== undefined) { rendermod = mod; }
      if (rendermod) { setTimeout(_=>this.setState({})); }
    };
  }

  mapFields(callback, custommap) {
    this.rerender(false);
    const res = jet.obj.map(custommap||this.fields, (val, k)=>{
      const field = this.fields[k];
      return field ? callback(field, val) : undefined;
    });
    this.rerender(true);
    return res;
  }

  findField(callback, def) {
    for (let i in this.fields) {
      const resp = callback(this.fields[i]);
      if (resp !== undefined) { return resp; }
    }
    return def;
  }

  getFocus() { return this.findField(field=>field.getFocus() ? true : undefined, false); }

  isOutputDirty() { return this.findField(field=>field.isOutputDirty() ? true : undefined, false); }
  isInputDirty() { return this.findField(field=>field.isInputDirty() ? true : undefined, false); }

  getOutputDirty() { return this.mapFields(field=>field.isOutputDirty() ? field.getOutput() : undefined); }
  getInputDirty() { return this.mapFields(field=>field.isInputDirty() ? field.getInput() : undefined); }

  getRawput() { return this.mapFields(field=>field.getRawput()); }
  getOutput() { return this.mapFields(field=>field.getOutput()); }
  getInput() { return this.mapFields(field=>field.getInput()); }

  async setRawput(rawput) { this.mapFields((field, val)=>field.setRawput(val), rawput); }
  async setOutput(output) { this.mapFields((field, val)=>field.setOutput(val), output); }
  async setInput(input) { this.mapFields((field, val)=>field.setInput(val), input); }

  submit() { return this.mapFields(field=>field.submit()); }
  reject() { return this.mapFields(field=>field.reject()); }
  reset() { return this.mapFields(field=>field.reset()); }

  withEvents(ele, inject) {
    const props = this.props;
    Form.passEvents.map(e=>inject[e] = [props[e], ele.props[e]]);
    Form.bubblingEvents.map(e=>inject[e] = [this.rerender, props[e], ele.props[e]]);
    return inject;
  }

  injectProps(ele, key, level) {
    if (ele.type === Button) { return Button.injectParent(this, ele, key, level); }
    const { labels, titles, rawput, output, input } = this.props;
    const { label, title } = ele.props;
    const name = Form.fetchName(ele.props.name, key, level);
    return this.withEvents(ele, {
      name, ref:el=>this.fields[name] = el, parent:this,
      rawput: rawput[name], output: output[name], input:input[name],
      label: Form.fetchValue(labels, name, label),
      title: Form.fetchValue(titles, name, title)
    })
  }

  fetchPropsSelf() {
    const { children } = this.props;
    return {
      ...super.fetchPropsSelf(css),
      onReset:ev=>{ this.reset(); jet.event.stop(ev); },
      onSubmit:ev=>{ this.submit(); jet.event.stop(ev); },
      children:jet.react.injectProps(React.Children.toArray(children), this.injectProps.bind(this), true, Form.childs)
    };
  }

  render() {
    return <form {...this.fetchPropsSelf()}/>
  }
}


export default Form;




