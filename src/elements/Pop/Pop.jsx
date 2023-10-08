import React, { Component } from 'react';
import jet from "@randajan/jet-core";

import "./Pop.scss";

import { cn } from '../../css';


const defaultFlags = {
  top: p => p.isTop(),
  lock: p => p.state.lock
}

export const Pop = props => {
  const { ctrl, id, className, title, flags, lock, children, closeButton } = props;

  return (
    <div {...{
      id, title, className: cn("Pop", className),
      "data-flags": Component.jet.flags({ ...defaultFlags, ...flags }, ctrl)
    }}>
      <nav className={cn("nav")}>
        <div className={cn("close")} onClick={lock ? null : ctrl.down.bind(ctrl)}>{closeButton}</div>
      </nav>
      <div className={cn("content")}>
        {children}
      </div>
      <div className={cn("mist")} />
    </div>
  )
}
