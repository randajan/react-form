import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Button } from "../Button/Button";
import { Label } from "../Label/Label";

import "./Field.scss";

import { Valuable } from '../../components/Valuable';
import { cn } from '../../css';

export class Field extends Valuable {

  static className = "Field";

  static bindMethods = [
    ...Valuable.bindMethods,
    "autoSize", "handleKeyDown"
  ];

  static customProps = [
    ...Valuable.customProps,
    "children", "name", "type", "rows", "cols", "maxLength", "onKeyDown", "onPaste", "label", "input", "output", "rawput",
    "min", "max", "step", "tabIndex", "autoCorrect", "autoCapitalize", "spellCheck", "autoComplete", "autoSize"
  ];
  
  static propTypes = {
    ...Valuable.propTypes,
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea", "password"]),
    rows:PropTypes.number,
    cols:PropTypes.number,
    min:PropTypes.number,
    max:PropTypes.number,
    step:PropTypes.number,
    maxLength:PropTypes.number,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func
  }
  
  static defaultProps = {
    ...Valuable.defaultProps,
    type:"text",
    rows:1,
    cols:20,
  }

  static defaultFlags = {
    ...Valuable.defaultFlags,
    blank:p=>!jet.isFull(p.getInput()),
    full:p=>p.state.mark===1,
    autosize:p=>p.props.autoSize,
  }

  isTextArea() { return this.props.type === "textarea"; }

  getOnbox() { return this.isTextArea() ? this.inbox : this.onbox; }

  getCarret() {
    const inbox = this.inbox;
    return [ inbox.selectionStart, inbox.selectionEnd ];
  };

  setCarret(start, end) {
    const inbox = this.inbox;
    const { input } = this.state;
    if (input && inbox.setSelectionRange) {
      inbox.setSelectionRange(input.carret(start), input.carret(end));
    };
  }

  afterMount() {
    let autoSizeTimeout;
    this.cleanUp.add(Element.jet.listen(window, "resize", _=>{
      clearTimeout(autoSizeTimeout);
      autoSizeTimeout = setTimeout(this.autoSize, 50);
    }));
  }

  afterRender(propUpdated, from) {
    super.afterRender(propUpdated, from);
    
    const { inbox, onbox, state } = this;
    const { focus, input } = state;

    if (onbox && onbox.value !== input) { onbox.value = String.jet.to(input); }
    if (inbox.value !== input) { inbox.value = String.jet.to(input); }
    if (focus) { inbox.focus(); } else { inbox.blur(); } //sync state with reality
    this.autoSize();
  }

  autoSize(force) {
    if (!this.props.autoSize && !force) { return false; }
    const onbox = this.getOnbox();
    const style = onbox.style;
    style.height = style.width = null; 
    onbox.wrap = "off";
    style.width = (onbox.scrollWidth+5) + "px";
    if (this.isTextArea()) {
      onbox.wrap="soft"; 
      style.height = onbox.scrollHeight + "px";
      style.width = (onbox.scrollWidth+5) + "px";
    }
    return true;
  }

  handleKeyDown(ev) {
    const onKeyDown = this.props.onKeyDown;
    const k = ev.keyCode;
    if (this.state.lock) { return ev.preventDefault(); }
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.undo(); } } //escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blur(); } //not enter
    else { return; }

    ev.preventDefault();
  }


  validateValue(to, from, force) {
    const { type, min, max, step, maxLength } = this.props;
    const val = maxLength > 0 ? String.jet.to(to).slice(0, maxLength) : to;
    if (type !== "number") { return val; }
    const num = Number.jet.to(val);
    return !force ? num : step ? Number.jet.snap(num, step, min, max) : Number.jet.frame(num, min, max);
  }

  validateState(now, from) {
    now = super.validateState(now, from);
    const { maxLength } = this.props;
    now.mark = maxLength ? now.input.length / maxLength : 0;
    return now;
  }

  fetchPropsInbox() {
    const { tabIndex, name, autoCorrect, autoCapitalize, spellCheck, autoComplete, onPaste, maxLength, step } = this.props;
    const { focus, lock } = this.state;
    return {
      ref:el=>this.inbox = el, className:cn("inbox"),
      name, autoFocus:focus, autoCorrect, autoCapitalize, spellCheck, autoComplete, maxLength, 
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex, step,
      onFocus: this.focus,
      onBlur: this.blur,
      onInput: ev=> this.setInput(ev.target.value),
      onKeyDown: this.handleKeyDown,
      onPaste: ev=>{if (onPaste) {onPaste(this, ev)}}
    };
  }

  fetchPropsOnbox() {
    const { rows, cols } = this.props;
    return { ref:el=>this.onbox = el, className:cn("onbox"), rows, cols };
  }

  fetchPropsMark() {
    const { mark } = this.state;
    return {
      ref:el=>this.mark, className:cn("mark"),
      style:{width:(mark*100)+"%"}
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return { name, children:label }
  }

  render() {
    const { type, children } = this.props;
    return (
      <div {...this.fetchProps(type)}>
        <div className={cn("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div className={cn("interface")}>
            {
              this.isTextArea() ? 
              <textarea {...this.fetchPropsOnbox()} {...this.fetchPropsInbox()} /> :
              [
                <textarea key={0} {...this.fetchPropsOnbox()}/>,
                <input key={1} {...this.fetchPropsInbox()} type={type}/> 
              ]
            }
          </div>
          <div className={cn("underline")}>
            <div {...this.fetchPropsMark()}/>
          </div>
        </div>
        {Component.jet.inject(children, ele=>Button.injectParent(this, ele), true, [Button])}
      </div>
    );

  }
}
