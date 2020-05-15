import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Label from "../Label/Label";
import Feed from "../Feed/Feed";

import Proper from "../../Helpers/Proper" 

import css from "./Field.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Field extends Component {

  static propTypes = {
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea", "password"]),
    onChange: PropTypes.func
  }

  static defaultProps = {
    type:"text",
    rows:1,
    cols:20,
    onChange: ()=>{}
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  isTextArea() { return this.refs.feed.isTextArea(); }
  isFocused() { return this.refs.feed.isFocused(); }

  setInput(input) { return this.refs.feed.setInput(input); }
  setOutput(output) { return this.refs.feed.setInput(output); }
  getInput() { return this.refs.inbox.getValue(); }
  getOutput() { return this.refs.outbox.getValue(); }

  undo() { return this.refs.feed.undo(); }
  clear(hard) { return this.refs.feed.clear(hard); }
  reset(hard) { return this.refs.feed.reset(hard); }

  focus() { return this.refs.feed.focus(); }
  blur() { return this.refs.feed.blur(); }
  escape() { return this.refs.feed.escape(); }

  setCarret(start, end) { return this.refs.feed.setCarret(start, end); }
  getCarret() { return this.refs.feed.getCarret(); }

  async setState(feed, changes) {
      await super.setState(feed.state);
      this.props.onChange(feed, changes);
  }

  fetchPropsSelf() {
    const { label, title, type, className, readOnly } = this.props;
    const { focus, input } = this.state;

    return {
      className:CN.get("Field", readOnly?"readonly":"editable", focus ? "focus" : "blur", input ? "full" : "empty", className),
      title:title || label || type.capitalize(),
      onClick:_=>this.refs.feed.focus(),
    }
  }

  fetchPropsLabel() {
    const { label, title, type } = this.props;
    return {
      children:label || title || type.capitalize(),
      className:CN.pass("Label")
    }
  }

  fetchPropsFeed() {
    const { label, title, name, className } = this.props;

    return Proper.pass(this.props, {
      ref:"feed", className:CN.pass("Feed"),
      name:name || label.simplify() || title.simplify() || type,
      onChange:this.setState.bind(this),
    }, {
      label, title, name, className 
    })
  }

  render() {
    return (
      <div {...this.fetchPropsSelf()}>
        <Label {...this.fetchPropsLabel()}/>
        <Feed {...this.fetchPropsFeed()}/>
        <div className={CN.get("underline")}/>
      </div>
    )
  }
}

export default Field;
