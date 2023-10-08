import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";
import { RunPool } from "@randajan/jet-core";

import { cn } from "../css";

class Flagable extends Component {

  static propTypes = {
    flags:PropTypes.object,
  }

  static defaultProps = {
    flags:{}
  }

  static defaultFlags = {

  }

  cleanUp = new RunPool();

  constructor(props) {
    super(props);
    this.self = this.constructor;
    
  }
  
  componentDidMount() { this.draft(); this.draw(this.props, {}); }
  componentDidUpdate(props) { this.draw(this.props, props); }
  componentWillUnmount() { this.cleanUp.run(); this.cleanUp.flush(); }

  draft() {}
  draw(to, from) {}

  fetchPropsSelf(...classNames) {
    const { id, title, style, className, flags } = this.props;
    return {
      ref:body=>this.body = body,
      id, className:cn(this.self.className, className, ...classNames),
      "data-flags":Component.jet.flags({...this.self.defaultFlags, ...flags}, this),
      title, style
    }
  
  }

}

export default Flagable;
