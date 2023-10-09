import React from 'react';
import { CSSTransition } from "react-transition-group";
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Flagable } from "../../components/Flagable";
import { cn } from '../../css';

import "./Trigger.scss";


export class Trigger extends Flagable {

  static className = "Trigger";

  static bindMethods = [
    ...Flagable.bindMethods,
    "handleClick"
  ];

  static customProps = [
    ...Flagable.customProps,
    "onTap", "lock", "active", "switch", "transition"
  ];

  static defaultFlags = {
    active: p => p.props.active,
    lock: p => p.props.lock,
    switch: p => p.props.switch
  }

  static propTypes = {
    ...Flagable.propTypes,
    onTap: PropTypes.func,
  }

  handleClick(ev) {
    const { lock, active, onTap } = this.props;
    const sw = this.props.switch;
    if (lock || (!sw && active)) { return; }
    jet.run(onTap, sw ? !active : true);
    ev?.preventDefault();
  }

  fetchProps() {
    return {
      ...super.fetchProps(),
      onClick: this.handleClick,
    };
  }

  fetchTransitionProps() {
    const { transition, appear, active } = this.props;
    return { in: active, timeout: transition, appear, classNames: cn.transitions }
  }

  render() {
    const body = <div {...this.fetchProps()} />;
    return this.props.transition ? <CSSTransition {...this.fetchTransitionProps()} children={body} /> : body;
  }
}
