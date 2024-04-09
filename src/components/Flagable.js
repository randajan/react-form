import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";
import RunPool from "@randajan/jet-core/runpool";

import { cn } from "../css";

const { solid } = jet.prop;

export class Flagable extends Component {

  static className = "Flagable";

  static bindMethods = [];
  static customProps = ["flags"];

  static propTypes = {
    flags: PropTypes.object,
  }

  static defaultProps = {
    flags: {}
  }

  static defaultFlags = {

  }

  cleanUp = new RunPool();

  constructor(props) {
    super(props);

    const self = this.constructor;

    solid(this, "self", self);

    //autobind
    for (const method of self.bindMethods) { solid(this, method, this[method].bind(this)); }

  }

  componentDidMount() {
    this.afterMount();
    this.afterRender();
  }

  componentDidUpdate(props) {
    this.afterRender();
  }

  componentWillUnmount() {
    this.cleanUp.run();
    this.cleanUp.flush();
  }

  afterMount() { }
  afterRender() { }

  fetchProps(...classNames) {
    const { props, self: { className, customProps, defaultFlags } } = this;

    return Component.jet.buildProps(props, {
      ref: body => this.body = body,
      className: cn(className, props.className, ...classNames),
      "data-flags": Component.jet.flags({ ...defaultFlags, ...props.flags }, this)
    }, customProps);

  }

}
