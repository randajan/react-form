import React from 'react';
import { CSSTransition } from "react-transition-group";
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Trigger.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Trigger extends Flagable {

  static defaultFlags = {
    active:p=>p.props.active,
    lock:p=>p.props.lock,
    switch:p=>p.props.switch
  }

  static propTypes = {
    ...Flagable.propTypes,
    onTap:PropTypes.func,
  }

  fetchPropsSelf() {
    const { children, lock, onTap } = this.props;
    const sw = this.props.switch;
    const active = jet.to("boolean", this.props.active);
    return {
      ...super.fetchPropsSelf(css), children,
      onClick:(lock || (!sw && active))?null:_=>jet.run(onTap, sw ? !active : true)
    };
  }

  fetchTransitionProps() {
    const { transition, appear, active } = this.props;
    return { in:active, timeout:transition, appear, classNames:css.transitions()}
  }

  render() {
    const body = <div {...this.fetchPropsSelf()}/>;
    return this.props.transition ? <CSSTransition {...this.fetchTransitionProps()} children={body}/> : body;
  }
}

export default Trigger;
