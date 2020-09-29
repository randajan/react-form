import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Stateful from "./Stateful";


class Focusable extends Stateful {

  static propTypes = {
    ...Stateful.propTypes,
    fitFocus:PropTypes.func
  }

  static defaultFlags = {
    ...Stateful.defaultFlags,
    lock:p=>p.getLock(),
    focus:p=>p.getFocus(),
  }

  static fetchPropState(props, self) {
    const { lock, focus} = props;
    return {
      lock:jet.to("boolean", lock),
      focus:jet.to("boolean", focus)
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

  focusValidator() {

  }

  validateState(to, from) {
    to = super.validateState(to, from);
    const { onFocus, onBlur, fitFocus } = this.props;
    
    if (to.lock) { to.focus = false; }
    else if (fitFocus) { to.focus = jet.to("boolean", fit(to.focus, from.focus)); }

    const watcher = to.focus ? onFocus : onBlur;
    if (watcher && to.focus !== from.focus) { jet.run(watcher, this, to.focus); }

    return to;
  }

}

export default Focusable;
