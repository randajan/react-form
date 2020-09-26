import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jet from "@randajan/jetpack";


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
  
  componentDidMount() { this.draft(); this.draw(); }
  componentDidUpdate() { this.draw(); }
  componentWillUnmount() { this.cleanUp.run(); this.cleanUp.flush(); }

  draft() {}
  draw() {}

  fetchPropsSelf(css) {
    const { id, title, name, style, className, type, flags } = this.props;
    return {
      ref:body=>this.body = body,
      id, name, className:css.get(this.constructor.name, type, className),
      "data-flags":jet.react.fetchFlags({...this.constructor.defaultFlags, ...flags}, this),
      title, style
    }
  }

}

export default Flagable;
