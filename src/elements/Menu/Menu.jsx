import React, { useContext } from 'react';
import PropTypes from "prop-types";

import jet from "@randajan/jet-react";

import { Focusable } from "../../components/Focusable";

import { Trigger } from '../Trigger/Trigger';
import { Pane } from '../Pane/Pane';

import "./Menu.scss";

const context = React.createContext();;

export class Menu extends Focusable {

  static use() { return useContext(context); }

  static className = "Menu";

  static bindMethods = [
    ...Focusable.bindMethods,
    "setFocus"
  ];

  static customProps = [
    ...Focusable.customProps,
    "children", "flat", "noblur", "position", "transition", "trigger"
  ];

  static defaultFlags = {
    ...Focusable.defaultFlags,
    flat: p => p.props.flat,
    noblur: p => p.props.noblur,
    position: p => p.props.position
  }

  static propTypes = {
    ...Focusable.propTypes,
    flat: PropTypes.bool
  }

  static defaultProps = {
    ...Focusable.defaultProps,
    "position": "top"
  }

  afterRender() {
    const { body, cleanUp, props:{ noblur }, state:{ focus } } = this;
    cleanUp.run();
    cleanUp.flush();
    if (!body || !focus || noblur) { return; }
    cleanUp.add(Element.jet.listen(document, "mouseup", ev => {
      const target = ev.target;
      const now = (body && (body === target || body.contains(target)));
      if (!focus !== !now) { this.setFocus(now); }
    }))
  }

  fetchTriggerProps() {
    const { state:{ focus }, props:{ transition, trigger, noblur } } = this;

    return {
      ref: el => this.trigger = el,
      switch: noblur, active: focus, transition,
      children: trigger,
      onTap: this.setFocus
    }
  }

  fetchPaneProps() {
    const { state:{ focus }, props:{ transition, position, children } } = this;

    return {
      ref: pane => this.pane = pane,
      unmountOnExit: true, expand: focus, position, transition, children,
    }
  }

  render() {
    const { children, flat } = this.props;

    return (
      <context.Provider value={this}>
        <div {...this.fetchProps()}>
          {
            flat ? children :
              <React.Fragment>
                <Trigger {...this.fetchTriggerProps()} />
                <Pane {...this.fetchPaneProps()} />
              </React.Fragment>
          }
        </div>
      </context.Provider>
    )
  }
}

