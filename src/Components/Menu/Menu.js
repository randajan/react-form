import React, { useContext } from 'react';
import PropTypes from "prop-types";

import jet from "@randajan/react-jetpack";

import Focusable from "../../Dummy/Focusable";

import Trigger from "../Trigger/Trigger";
import Pane from "../Pane/Pane";

import cssfile from "./Menu.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Menu extends Focusable {

  static Context = React.createContext();

  static defaultFlags = {
    ...Focusable.defaultFlags,
    flat:p=>p.props.flat,
    noblur:p=>p.props.noblur,
    position:p=>p.props.position
  }

  static propTypes = {
    ...Focusable.propTypes,
    flat:PropTypes.bool
  }

  static defaultProps = {
    ...Focusable.defaultProps,
    "position":"top"
  }

  static use() { return useContext(Menu.Context); }

  draw() {
    const { noblur } = this.props;
    const { focus, lock } = this.state;
    const body = this.body;
    this.cleanUp.run();
    if (!body || lock || noblur) { return; }
    this.cleanUp.add(jet.event.hear(focus ? document : body, "mouseup", ev=>{
        const target = ev.target;
        const now = (body && (body === target || body.contains(target)));
        if (!focus !== !now) { this.setFocus(now); }
    }))
  }

  fetchTriggerProps() {
    const { transition, placeHolder, noblur } = this.props;
    const { focus } = this.state;

    return {
      ref:el=>this.placeholder=el,
      switch:noblur, active:focus, transition, 
      className:css.get("Trigger"),
      children:placeHolder,
      onTap:this.setFocus.bind(this)
    }
  }

  fetchPaneProps() {
    const { transition, unmountOnExit, position, children} = this.props;
    const { focus } = this.state;
    return {
      ref:pane=>this.pane = pane,
      expand:focus, position,transition, unmountOnExit, children,
      className:css.get("Pane"),
    }
  }

  render() {
    const { children, flat } = this.props;
    return (
      <Menu.Context.Provider value={this}>
      <div {...this.fetchPropsSelf(css)}>
        {
          flat?children:
          <React.Fragment>
            <Trigger {...this.fetchTriggerProps()}/>
            <Pane {...this.fetchPaneProps()}/>
          </React.Fragment>
        }
      </div>
      </Menu.Context.Provider>
    )
  }
}

export default Menu;

