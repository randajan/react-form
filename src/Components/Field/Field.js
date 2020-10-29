import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Button from "../Button/Button";
import Label from "../Label/Label";

import cssfile from "./Field.scss";
import csslib from "../../css";

import Valuable from '../../Dummy/Valuable';

class Field extends Valuable {

  static css = csslib.open(cssfile);
  static className = "Field";
  
  static propTypes = {
    ...Valuable.propTypes,
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea", "password"]),
    rows:PropTypes.number,
    cols:PropTypes.number,
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
    blank:p=>jet.isEmpty(p.getInput()),
    full:p=>p.state.mark===1,
    autosize:p=>p.props.autoSize,
  }

  box = {}

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

  draft() {
    let autoSizeTimeout;
    this.cleanUp.add(jet.event.hear(window, "resize", _=>{
      clearTimeout(autoSizeTimeout);
      autoSizeTimeout = setTimeout(this.autoSize.bind(this), 50);
    }));
  }

  draw() {
    const { inbox, onbox, state } = this;
    const { focus, input } = state;

    if (onbox && onbox.value !== input) { onbox.value = jet.str.to(input); }
    if (inbox.value !== input) { inbox.value = jet.str.to(input); }
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
    if (this.state.lock) { return jet.event.stop(ev); }
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.undo(); } } //escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blur(); } //not enter
    else { return }

    jet.event.stop(ev);
  }


  validateValue(to, from, kind) {
    const { type } = this.props;
    to = jet.str.to(to);
    if (kind !== "input") {
      if (type === "number") { return jet.num.to(to); }
    }
    return to.slice(0, this.props.maxLength);
  }

  validateState(now, from) {
    now = super.validateState(now, from);
    const { maxLength } = this.props;
    now.mark = maxLength ? now.input.length / maxLength : 0;
    return now;
  }

  fetchPropsInbox() {
    const {tabIndex, name, autoCorrect, autoCapitalize, spellCheck, autoComplete, onPaste, maxLength } = this.props;
    const { focus, lock } = this.state;
    return {
      ref:el=>this.inbox = el, className:Field.css.get("inbox"),
      name, autoFocus:focus, autoCorrect, autoCapitalize, spellCheck, autoComplete, maxLength, 
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex,
      onFocus: _=> this.focus(),
      onBlur: _=> this.blur(),
      onInput: ev=> this.setInput(ev.target.value),
      onKeyDown: this.handleKeyDown.bind(this),
      onPaste: ev=>{if (onPaste) {onPaste(this, ev)}}
    };
  }

  fetchPropsOnbox() {
    const { rows, cols } = this.props;
    return { ref:el=>this.onbox = el, className:Field.css.get("onbox"), rows, cols };
  }

  fetchPropsMark() {
    const { mark } = this.state;
    return {
      ref:el=>this.mark, className:Field.css.get("mark"),
      style:{width:(mark*100)+"%"}
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return {
      className:Field.css.get("Label"), name,
      children:label
    }
  }

  render() {
    const { type, children } = this.props;
    return (
      <div {...this.fetchPropsSelf(type)}>
        <div className={Field.css.get("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div className={Field.css.get("interface")}>
            {
              this.isTextArea() ? 
              <textarea {...this.fetchPropsOnbox()} {...this.fetchPropsInbox()} /> :
              [
                <textarea key={0} {...this.fetchPropsOnbox()}/>,
                <input key={1} {...this.fetchPropsInbox()} type={type}/> 
              ]
            }
          </div>
          <div className={Field.css.get("underline")}>
            <div {...this.fetchPropsMark()}/>
          </div>
        </div>
        {jet.react.injectProps(children, ele=>Button.injectParent(this, ele), true, Button)}
      </div>
    );

  }
}

export default Field;
