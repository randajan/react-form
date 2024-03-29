import React, { useContext } from 'react';
import PropTypes from "prop-types";

import jet from "@randajan/jet-react";

import Focusable from "../../Dummy/Focusable";

import Trigger from "../../Components/Trigger/Trigger";
import Pane from "../Pane/Pane";

import "./Menu.scss";

class Menu extends Focusable {

  static className = "Menu";

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
    const { focus } = this.state;
    const body = this.body;
    this.cleanUp.run();
    if (!body || !focus || noblur) { return; }
    this.cleanUp.add(Element.jet.listen(document, "mouseup", ev=>{
        const target = ev.target;
        const now = (body && (body === target || body.contains(target)));
        if (!focus !== !now) { this.setFocus(now); }
    }))
  }

  fetchTriggerProps() {
    const { transition, trigger, noblur } = this.props;
    const { focus } = this.state;

    return {
      ref:el=>this.trigger=el,
      switch:noblur, active:focus, transition,
      children:trigger,
      onTap:this.setFocus.bind(this)
    }
  }

  fetchPaneProps() {
    const { transition, position, children} = this.props;
    const { focus } = this.state;
    return {
      ref:pane=>this.pane = pane,
      unmountOnExit:true, expand:focus, position, transition, children,
    }
  }

  render() {
    const { children, flat } = this.props;
    return (
      <Menu.Context.Provider value={this}>
      <div {...this.fetchPropsSelf()}>
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

