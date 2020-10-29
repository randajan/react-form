import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "./Flagable";

class Stateful extends Flagable {

  state;

  constructor(props) {
    super(props);
    this.state = this.validateState(this.fetchPropState(), {});
  }

  fetchPropState(props) { return {}; }

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
    return this.setState(this.fetchPropState());
  }

  validateState(to, from) { return jet.obj.merge(from, to); }

}

export default Stateful
