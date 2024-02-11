import React from 'react';

import jet from "@randajan/jet-react";
import { RunPool } from "@randajan/jet-core";

import { Flagable } from "./Flagable";

const { virtual, solid } = jet.prop;

export class Stateful extends Flagable {

  static customProps = [
    ...Flagable.customProps,
    "onChange"
  ];

  static stateProps = [

  ];

  effect = new RunPool();

  constructor(props) {
    super(props);
    const propState = this.fetchPropState(props);
    this.state = this.validateState(propState, propState);
  }

  componentDidUpdate(props) {
    const stateProps = {};
    let propsUpdated = false;

    for (const sp of this.self.stateProps) {
      if (this.props[sp] === props[sp]) {
        stateProps[sp] = this.state[sp];
      } else {
        stateProps[sp] = this.props[sp];
        propsUpdated = true;
      }
    }

    if (propsUpdated) {
      this.setState(this.fetchPropState(stateProps));
    } else {
      super.componentDidUpdate();
    }
  }

  fetchPropState(changes) {
    return {};
  }

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
    return this.setState(this.fetchPropState(this.props));
  }

  validateState(to, from) { return jet.merge(from, to); }

}
