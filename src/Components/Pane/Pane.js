import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from "react-transition-group";
import ReactResizeDetector from 'react-resize-detector';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Pane.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

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

  state = {
    width:0,
    height:0
  }

  draw() {
    const { content, body, state, props } = this;
    const { position, expand } = props;
    if (!content || !body ) { return; }
    
    const { width, height } = state;
    position.split("-").map(dir=>{
      const vertical = (dir === "top" || dir === "bottom");
      const val = expand ? 0 : vertical ? height : width;
      content.style["margin-"+dir] = -val+"px";
      if (!vertical) { body.style.float = dir; }
    });

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
    const { children } = this.props;
    return { children, className:css.get("content"), ref:el=>this.content = el}
  }

  fetchPropsResize() {
    return {
      targetRef:this.content,
      onResize:(width, height)=>this.setState({width, height})
    }
  }

  render() {
    const body = (
      <div {...this.fetchPropsSelf(css)}>
        <ReactResizeDetector {...this.fetchPropsResize()}>
          <div {...this.fetchPropsContent()}/>
        </ReactResizeDetector>
      </div>
    );

    return this.props.transition ? <CSSTransition {...this.fetchPropsTransition()} children={body}/> : body;
  }

}

export default Pane;
