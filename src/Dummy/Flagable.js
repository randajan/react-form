import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";


class Flagable extends Component {

  static propTypes = {
    flags:PropTypes.object,
  }

  static defaultProps = {
    flags:{}
  }

  static defaultFlags = {

  }

  cleanUp = new jet.RunPool();

  constructor(props) {
    super(props);
    this.self = this.constructor;
    this.css = this.constructor.css;
  }
  
  componentDidMount() { this.draft(); this.draw(this.props, {}); }
  componentDidUpdate(props) { this.draw(this.props, props); }
  componentWillUnmount() { this.cleanUp.run(); this.cleanUp.flush(); }

  draft() {}
  draw(to, from) {}

  fetchPropsSelf(...classNames) {
    const { id, title, name, style, className, flags } = this.props;
    return {
      ref:body=>this.body = body,
      id, name, className:this.css.get(this.self.className, className, ...classNames),
      "data-flags":jet.react.fetchFlags({...this.self.defaultFlags, ...flags}, this),
      title, style
    }
  }

}

export default Flagable;
