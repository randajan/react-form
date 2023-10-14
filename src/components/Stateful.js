import React from 'react';

import jet from "@randajan/jet-react";
import { RunPool } from "@randajan/jet-core";

import { Flagable } from "./Flagable";

export class Stateful extends Flagable {

  static customProps = [
    ...Flagable.customProps,
    "onChange"
  ];

  effect = new RunPool();

  constructor(props) {
    super(props);
    this.state = this.validateState(this.fetchPropState(), {});
  }

  fetchPropState() { return {}; }

  setState(state) {
    this.effect.flush();
    const { onChange } = this.props;
    const from = Object.jet.tap(this.state);
    const to = this.validateState(state, from);
    const changes = jet.compare(from, to, true);
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

  validateState(to, from) { return jet.merge(from, to); }

}
