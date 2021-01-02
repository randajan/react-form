import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "./Flagable";

class Stateful extends Flagable {

  state;
  effect = jet.rupl();

  constructor(props) {
    super(props);
    this.state = this.validateState(this.fetchPropState(), {});
  }

  fetchPropState(props) { return {}; }

  setState(state) {
    this.effect.flush();
    const { onChange } = this.props;
    const from = jet.obj.tap(this.state);
    const to = this.validateState(state, from);
    const changes = jet.map.compare(from, to);
    if (changes.length) {
      super.setState(to);
      jet.fce.run(onChange, this, changes);
      this.effect.run();
      this.effect.flush();
    }
    return changes;
  }

  reset() {
    return this.setState(this.fetchPropState());
  }

  validateState(to, from) { return jet.map.merge(from, to); }

}

export default Stateful
