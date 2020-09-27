import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from "react-transition-group";
import ReactResizeDetector from 'react-resize-detector';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Pane.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Driftable extends Component {

  state = {
    appear:true,
    width:0,
    height:0
  }

  forEachDirection(callback) {
    const { drift, direction } = this.props;
    direction.split("-").map(dir=>callback(dir, drift));
  }

  componentDidUpdate() {
    const { state, body } = this;
    const { width, height, appear } = state;
    this.forEachDirection((dir, drift)=>{
      const vertical = (dir === "top" || dir === "bottom");
      const val = (drift || appear) ? vertical ? height : width : null;
      body.style["margin-"+dir] = -val+"px";
    });
    if (appear) { setTimeout(_=>this.setState({appear:false})); }
  }

  fetchPropsSelf() {
    const { appear } = this.state;
    const props = this.props;
    const pass = {
      ...props,
      ref:el=>this.body=el,
      className:css.get(props.className, appear?"appear":""),
      style:jet.get("object", props.style),
    }

    this.forEachDirection(dir=>pass.style["margin"+dir.capitalize()] = "-9999px");

    delete pass.drift;
    delete pass.direction;

    return pass;
  }

  fetchPropsResize() {
    return {
      targetRef:this.body,
      onResize:(width, height)=>this.setState({width, height}),
    }
  }

  render() {
    return (
      <ReactResizeDetector {...this.fetchPropsResize()}>
        <div {...this.fetchPropsSelf()}/>
      </ReactResizeDetector>
    );
  }
}

class Pane extends Flagable {

  static propTypes = {
    ...Flagable.propTypes,
    position:PropTypes.oneOf(["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]),
  }

  static defaultProps = {
    ...Flagable.defaultProps,
    position: "top"
  }

  static defaultFlags = {
    ...Flagable.defaultFlags,
    position:p=>p.props.position,
    expand:p=>p.props.expand
  }

  fetchPropsTransition() {
    const { expand, transition, appear, unmountOnExit } = this.props;
    return {
      in:expand,
      timeout:transition,
      unmountOnExit,
      appear,
      classNames:css.transitions()
    }
  }

  fetchPropsContent() {
    const { children, position, expand } = this.props;
    return { 
      className:css.get("content"),
      direction:position,
      drift:!expand,
      children,
    }
  }

  render() {
    const body = (
      <div {...this.fetchPropsSelf(css)}>
        <Driftable {...this.fetchPropsContent()}/>
      </div>
    );

    return this.props.transition ? <CSSTransition {...this.fetchPropsTransition()} children={body}/> : body;
  }

}

export default Pane;
