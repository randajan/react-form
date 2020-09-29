import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "./Flagable";

class Stateful extends Flagable {

  static fetchPropState(props, self) {
    return {};
  }

  state;

  constructor(props) {
    super(props);
    const self = this.constructor;
    const propstate = self.fetchPropState(props, self);
    this.state = this.validateState(propstate, {});
  }

  async setState(state) {
    const { onChange } = this.props;
    const from = jet.get("object", this.state);
    const to = this.validateState(state, from);
    const changes = jet.obj.compare(from, to);
    if (changes.length) {
      await super.setState(to); jet.run(onChange, this, changes);
    }
    return changes;
  }

  reset() {
    const self = this.constructor;
    return this.setState(self.fetchPropState(this.props, self));
  }

  validateState(to, from) { return jet.obj.merge(from, to); }

}

export default Stateful
