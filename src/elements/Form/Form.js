import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Flagable } from '../../components/Flagable';

import { Button } from "../Button/Button";

import { Field } from "../Field/Field";
import Switch from "../Switch/Switch";
import { Range } from "../Range/Range";

import "./Form.scss";

export class Form extends Flagable {

  static className = "Form";

  static childs = [Field, Switch, Range, Button];
  static eventsPass = [ "onInput", "onOutput", "onRawput" ];
  static eventsBubble = [ "onFocus", "onBlur", "onInputDirty", "onOutputDirty" ];

  static bindMethods = [
    ...Flagable.bindMethods,
    "injectProps"
  ];

  static customProps = [
    ...Flagable.customProps,
    "children", "rawput", "output", "input", "sync", "labels", "titles",
    "onInput", "onOutput", "onRawput", "onFocus", "onBlur", "onInputDirty", "onOutputDirty"
  ];

  static propTypes = {
    ...Flagable.propTypes,
    rawput:PropTypes.object,
    output:PropTypes.object,
    input:PropTypes.object,
    sync:PropTypes.number
  }

  static defaultProps = {
    ...Flagable.defaultProps,
    rawput:{},
    output:{},
    input:{},
    sync:50
  }

  static fetchName(name, key, level) {
    return String.jet.tap(name, Number.jet.toLetter(level)+key);
  }

  static fetchValue(val, key, def) {
    val = (Object.jet.is(val) ? val[key] : jet.isRunnable(val) ? val(key) : val);
    return val !== undefined ? val : def;
  }

  fields = {};
  timers = {};

  afterMount() {
    this.mounted = true;
    this.cleanUp.add(_=>this.mounted = false);
  }

  mapFields(callback, custommap) {
    return jet.forEach(custommap||this.fields, (val, k)=>{
      const field = this.fields[k];
      return field ? callback(field, val) : undefined;
    });
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

  setRawput(rawput) { return this.mapFields((field, val)=>field.setRawput(val), rawput); }
  setOutput(output) { return this.mapFields((field, val)=>field.setOutput(val), output); }
  setInput(input) { return this.mapFields((field, val)=>field.setInput(val), input); }

  submit() { return this.mapFields(field=>field.submit()); }
  reject() { return this.mapFields(field=>field.reject()); }
  reset() { return this.mapFields(field=>field.reset()); }
  undo() { return this.mapFields(field=>field.undo()); }

  injectEvents(ele, inject) {
    let bubble;
    const ject = type=>inject[type] = [(...a)=>this.eventHandle({type, bubble}, ...a), ele.props[type]];
    bubble = false; Form.eventsPass.map(ject);
    bubble = true; Form.eventsBubble.map(ject);
    return inject;
  }

  eventHandle(ev, ...a) {
    const { props, timers } = this
    const {type, bubble} = ev;
    const eye = props[type];

    clearTimeout(timers[type]); 
    timers[type] = setTimeout(_=>this.mounted ? jet.run(eye, this) : null, props.sync);

    if (!bubble) { return; }

    clearTimeout(timers.redraw);
    timers.redraw = setTimeout(_=>this.mounted ? this.setState({}) : null, props.sync);

  }

  injectProps(ele, key, level) {
    if (ele.type === Button) { return Button.injectParent(this, ele, key, level); }
    const { labels, titles, rawput, output, input } = this.props;
    const ep = ele.props;
    const name = Form.fetchName(ep.name, key, level);
    return this.injectEvents(ele, {
      name, ref:el=>this.fields[name] = el, parent:this,
      rawput: Form.fetchValue(rawput, name, ep.rawput),
      output: Form.fetchValue(output, name, ep.output),
      input: Form.fetchValue(input, name, ep.input),
      label: Form.fetchValue(labels, name, ep.label),
      title: Form.fetchValue(titles, name, ep.title),
    })
  }

  fetchProps() {
    const { children } = this.props;

    return {
      ...super.fetchProps(),
      onReset:ev=>{ this.reset(); ev?.preventDefault(); },
      onSubmit:ev=>{ this.submit(); ev?.preventDefault(); },
      children:Component.jet.inject(children, this.injectProps, true, Form.childs)
    };
  }

  render() {
    return <form {...this.fetchProps()}/>
  }
}



