import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";


class Flagable extends Component {

  static className;

  static propTypes = {
    flags:PropTypes.object,
  }

  static defaultProps = {
    flags:{}
  }

  static defaultFlags = {

  }

  cleanUp = new jet.RunPool();
  
  componentDidMount() { this.draft(); this.draw(this.props, {}); }
  componentDidUpdate(props) { this.draw(this.props, props); }
  componentWillUnmount() { this.cleanUp.run(); this.cleanUp.flush(); }

  draft() {}
  draw(to, from) {}

  fetchPropsSelf(css, ...extraClassNames) {
    const { id, title, name, style, className, flags } = this.props;
    return {
      ref:body=>this.body = body,
      id, name, className:css.get(this.constructor.className, className, ...extraClassNames),
      "data-flags":jet.react.fetchFlags({...this.constructor.defaultFlags, ...flags}, this),
      title, style
    }
  }

}

export default Flagable;
