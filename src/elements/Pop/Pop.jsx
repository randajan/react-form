import React, { Component } from 'react';
import jet from "@randajan/jet-core";

import "./Pop.scss";

import { cn } from '../../css';
import { Block } from '../Block/Block';

const { solid } = jet.prop;

export class Pop extends Block {

  static className = "Pop";

  static bindMethods = ["down"];

  static customProps = [
    ...Block.customProps,
    "ctrl", "lock", "closeButton", "up",
  ];

  static defaultFlags = {
    ...Block.defaultFlags,
    top: p => p.ctrl.isTop(),
    lock: p => p.ctrl.state.lock
  }

  constructor(props) {
    super(props);

    solid(this, "ctrl", props.ctrl);
  }

  down(ev) {
    return this.ctrl.down(ev);
  }

  fetchChildren() {
    const { lock, closeButton } = this.props;

    return (
      <>
        <nav className={cn("nav")}>
          <div className={cn("close")} onClick={lock ? null : this.down}>{closeButton}</div>
        </nav>
        <div className={cn("content")}>
          {super.fetchChildren()}
        </div>
        <div className={cn("mist")} />
      </>
    )
  }

}