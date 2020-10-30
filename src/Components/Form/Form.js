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

class Form extends Flagable {

  static css = csslib.open(cssfile);
  static className = "Form";

  static childs = [Field, Switch, Range, Button];
  static eventsPass = [ "onInput", "onOutput", "onRawput" ];
  static eventsBubble = [ "onFocus", "onBlur", "onInputDirty", "onOutputDirty" ];

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
    return jet.get("string", name, jet.num.toLetter(level)+key);
  }

  static fetchValue(val, key, def) {
    val = (jet.is("object", val) ? val[key] : jet.is("function", val) ? val(key) : val);
    return val !== undefined ? val : def;
  }

  fields = {};
  timers = {};

  draft() {
    this.mounted = true;
    this.cleanUp.add(_=>this.mounted = false);
  }

  mapFields(callback, custommap) {
    return jet.obj.map(custommap||this.fields, (val, k)=>{
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
    const { label, title } = ele.props;
    const name = Form.fetchName(ele.props.name, key, level);
    return this.injectEvents(ele, {
      name, ref:el=>this.fields[name] = el, parent:this,
      rawput: rawput[name], output: output[name], input:input[name],
      label: Form.fetchValue(labels, name, label),
      title: Form.fetchValue(titles, name, title)
    })
  }

  fetchPropsSelf(...classNames) {
    const { children } = this.props;
    return {
      ...super.fetchPropsSelf(...classNames),
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




