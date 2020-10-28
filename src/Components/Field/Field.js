import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Checker from "../../Helpers/Checker";

import Button from "../Button/Button";
import Label from "../Label/Label";

import cssfile from "./Field.scss";
import csslib from "../../css";

import Valuable from '../../Dummy/Valuable';

const css = csslib.open(cssfile);

class Field extends Valuable {

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
    blank:p=>!p.getInput(),
    full:p=>p.state.mark===1,
    autosize:p=>p.props.autoSize,
  }

  static validateValue(props, value) { return jet.str.to(value).slice(0, props.maxLength); }

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
    const checker = this.checker.bind(this);
    let autoSizeTimeout;
    Checker.list.add(checker);
    this.cleanUp.add(_=>Checker.list.rem(checker));
    this.cleanUp.add(jet.event.hear(window, "resize", _=>{
      clearTimeout(autoSizeTimeout);
      autoSizeTimeout = setTimeout(this.autoSize.bind(this), 50);
    }));
  }

  draw() {
    const { inbox, onbox, state } = this;
    const { focus, input, output } = state;

    if (onbox && onbox.value !== input) { onbox.value = input; }
    if (inbox.value !== input) { inbox.value = input; }
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

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.reject(); } } //escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blur(); } //not enter
    else { return }

    jet.event.stop(ev);
  }

  checker() {
    const { focus, output } = this.state;
    if (!focus) { this.inbox.value = output; }
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
      ref:el=>this.inbox = el, className:css.get("inbox"),
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
    return { ref:el=>this.onbox = el, className:css.get("onbox"), rows, cols };
  }

  fetchPropsMark() {
    const { mark } = this.state;
    return {
      ref:el=>this.mark, className:css.get("mark"),
      style:{width:(mark*100)+"%"}
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return {
      className:css.get("Label"), name,
      children:label
    }
  }

  render() {
    const { type, children } = this.props;
    return (
      <div {...this.fetchPropsSelf(css, type)}>
        <div className={css.get("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div className={css.get("interface")}>
            {
              this.isTextArea() ? 
              <textarea {...this.fetchPropsOnbox()} {...this.fetchPropsInbox()} /> :
              [
                <textarea key={0} {...this.fetchPropsOnbox()}/>,
                <input key={1} {...this.fetchPropsInbox()} type={type}/> 
              ]
            }
          </div>
          <div className={css.get("underline")}>
            <div {...this.fetchPropsMark()}/>
          </div>
        </div>
        {jet.react.injectProps(children, ele=>Button.injectParent(this, ele), true, Button)}
      </div>
    );

  }
}

export default Field;
