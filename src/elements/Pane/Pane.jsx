import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from "react-transition-group";

import jet from "@randajan/jet-react";

import { Stateful } from "../../components/Stateful";
import { cn } from '../../css';

import "./Pane.scss";


export class Pane extends Stateful {

  static className = "Pane";

  static customProps = [
      ...Stateful.customProps,
      "position", "expand", "transition", "unmountOnExit", "transition"
  ];

  static propTypes = {
    ...Stateful.propTypes,
    position:PropTypes.oneOf(["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]),
  }

  static defaultProps = {
    ...Stateful.defaultProps,
    position: "top"
  }

  static defaultFlags = {
    ...Stateful.defaultFlags,
    position:p=>p.props.position,
    expand:p=>p.props.expand,
  }

  static prebound = {
    width:"-100vw",
    height:"-100vw"
  }

  prebound = null;

  getBound() {
    const { width, height } = Element.jet.bound(this.content);
    return {
      width:-width+"px",
      height:-height+"px"
    }
  }

  afterRender() {
    const { content, props:{ expand } } = this;
    const bound = this.getBound();

    if (!expand) { this.prebound = null; }
    else if (!this.prebound) {
      this.prebound = bound;
      return this.forceUpdate();
    }

    if (content) {
      this.forEachPosition((pos, axis)=>
        content.style["margin-"+pos] = expand ? null : bound[axis]
      );
    }

  }

  forEachPosition(callback) {
    this.props.position.split("-").map(pos=>{
      callback(pos, (pos === "top" || pos === "bottom") ? "height" : "width");
    });
  }

  fetchPropsTransition() {
    const { expand, transition, unmountOnExit } = this.props;
    return {
      ref:transition=>this.transition=transition,
      in:expand,
      timeout:transition,
      unmountOnExit,
      appear:true,
      classNames:cn.transitions,
      children:this.renderBody()
    }
  }

  fetchPropsContent() {
    const { children, expand } = this.props;
    const style = {};

    if (expand) {
      const bound = (this.prebound || Pane.prebound);
      this.forEachPosition((pos, axis)=>
        style["margin"+String.jet.capitalize(pos)] = bound[axis]
      );
    }

    return {
      ref:el=>this.content=el,
      className:cn("content"),
      style,
      children
    }
  }

  renderBody() {
    const { transition, expand } = this.props;
    if (!transition && !expand) { return null; }
    return (
      <div {...this.fetchProps(transition?.appliedClasses)}>
        <div {...this.fetchPropsContent()}/>
      </div>
    )
  }

  renderTransition() {
    return <CSSTransition {...this.fetchPropsTransition()}/>
  }

  render() {
    const { transition, expand } = this.props;
    return (!transition || (expand && !this.prebound)) ? this.renderBody() : this.renderTransition();
  }

}
