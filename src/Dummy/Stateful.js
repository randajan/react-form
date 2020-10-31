import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "./Flagable";

class Stateful extends Flagable {

  state;
  effect = new jet.RunPool();

  constructor(props) {
    super(props);
    this.state = this.validateState(this.fetchPropState(), {});
  }

  fetchPropState(props) { return {}; }

  setState(state) {
    this.effect.flush();
    const { onChange } = this.props;
    const from = jet.get("object", this.state);
    const to = this.validateState(state, from);
    const changes = jet.obj.compare(from, to);
    if (changes.length) {
      super.setState(to);
      jet.run(onChange, this, changes);
      this.effect.run();
      this.effect.flush();
    }
    return changes;
  }

  reset() {
    return this.setState(this.fetchPropState());
  }

  validateState(to, from) { return jet.obj.merge(from, to); }

}

export default Stateful
