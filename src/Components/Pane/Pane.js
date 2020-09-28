import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from "react-transition-group";

import jet from "@randajan/react-jetpack";

import Stateful from "../../Dummy/Stateful";

import cssfile from "./Pane.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Pane extends Stateful {

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
    expand:p=>p.props.expand
  }

  static prebound = {
    width:"-100vw",
    height:"-100vw"
  }

  prebound = null;

  getBound() {
    const { width, height } = jet.web.getBound(this.content);
    return {
      width:-width+"px",
      height:-height+"px"
    }
  }

  draw() {

    const { expand } = this.props;
    const { content } = this;
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
    const { expand, transition } = this.props;
    return {
      in:expand,
      timeout:transition,
      unmountOnExit:true,
      appear:true,
      classNames:css.transitions(),
      children:this.renderBody()
    }
  }

  fetchPropsContent() {
    const { children, expand } = this.props;
    const style = {};

    if (expand) {
      const bound = (this.prebound || Pane.prebound);
      this.forEachPosition((pos, axis)=>
        style["margin"+pos.capitalize()] = bound[axis]
      );
    }

    return {
      ref:el=>this.content=el,
      className:css.get("content"),
      style,
      children
    }
  }

  renderBody() {
    const { transition, expand } = this.props;
    if (!transition && !expand) { return null; }
    return (
      <div {...this.fetchPropsSelf(css)}>
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

export default Pane;
