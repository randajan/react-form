import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Stateful } from "./Stateful";


export class Focusable extends Stateful {

  static bindMethods = [
    ...Focusable.bindMethods,
    "focus", "blur"
  ];

  static customProps = [
    ...Stateful.customProps,
    "parent", "lock", "focus", "onFocus", "onBlur", "fitFocus"
  ];

  static propTypes = {
    ...Stateful.propTypes,
    fitFocus:PropTypes.func
  }

  static defaultFlags = {
    ...Stateful.defaultFlags,
    lock:p=>p.getLock(),
    focus:p=>p.getFocus(),
  }

  static stateProps = [
    ...Stateful.stateProps,
    "lock", "focus"
  ];

  fetchPropState(props) {
    return {
      lock:Boolean.jet.to(props.lock),
      focus:Boolean.jet.to(props.focus),
    };
  }

  getName() { return this.props.name; }
  
  getFocus() { return this.state.focus || false; }
  getLock() { return this.state.lock || false; }

  setFocus(focus) { return this.setState({focus}); }
  setLock(lock) { return this.setState({lock}); }

  focus() { return this.setState({focus:true}); }
  blur() { return this.setState({focus:false}); }
  lock() { return this.setState({lock:true}); }
  unlock() { return this.setState({lock:false}); }

  validateState(to, from) {
    to = super.validateState(to, from);
    const { onFocus, onBlur, fitFocus } = this.props;
    
    if (to.lock) { to.focus = false; }
    else if (fitFocus) { to.focus = Boolean.jet.to(fitFocus(to.focus, from.focus)); }

    const watcher = to.focus ? onFocus : onBlur;
    if (watcher && to.focus !== from.focus) { this.effect.add(_=>jet.run(watcher, this, to.focus)); }

    return to;
  }

}