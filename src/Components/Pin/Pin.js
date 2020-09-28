import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Stateful from "../../Dummy/Stateful";

import cssfile from "./Pin.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Pin extends Stateful {

  static className = "Pin";

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    xMin: PropTypes.number,
    yMin: PropTypes.number,
    xMax: PropTypes.number,
    yMax: PropTypes.number,
    xStep: PropTypes.number,
    yStep: PropTypes.number,
    flags:PropTypes.object
  }

  static defaultProps = {
    x: 0,
    y: 0,
    xMin: 0,
    yMin: 0,
    xMax: 1,
    yMax: 1,
    xStep: 0.01,
    yStep: 0.01,
    flags:{}
  }

  static defaultFlags = {
    focus:p=> (!p.props.readOnly && p.state.focus),
    readonly:p=>p.props.readOnly,
    inverted:p=>p.props.inverted
  }

  static validateX(x, props) {
    const { xMin, xMax, xStep } = props;
    return xStep ? jet.num.snap(x, xStep, xMin, xMax) : jet.num.frame(x, xMin, xMax);
  }
  static validateY(y, props) {
    const { yMin, yMax, yStep } = props;
    return yStep ? jet.num.snap(y, yStep, yMin, yMax) : jet.num.frame(y, yMin, yMax);
  }

  static fetchPropState(props) {
    return {
      focus:false,
      x:Pin.validateX(props.x, props),
      y:Pin.validateY(props.y, props)
    }
  }

  handleShift(ev, bound, state) {
    const { xInverted, yInverted } = this.props;
    const x = Pin.validateX(xInverted ? 1-bound.x : bound.x, this.props);
    const y = Pin.validateY(yInverted ? 1-bound.y : bound.y, this.props);
    bound.x = xInverted ? 1-x : x;
    bound.y = yInverted ? 1-y : y;
    this.setState({ focus:state !== "stop", x, y });
  }

  draft() {
    const {x, y, xInverted, yInverted } = this.props;
    const bound = { x:xInverted ? 1-x:x, y:yInverted ? 1-y:y }
    this.cleanUp.add(jet.event.listenShift(this.refs.body, this.handleShift.bind(this), bound))
  }

  fetchSelfProps() {
    const { id, title, style, className, flags } = this.props;
    return {
      id, title, style, ref:"body", 
      className:css.get("Pin", className),
      "data-flags":jet.react.fetchFlags({...Pin.defaultFlags, ...flags}, this)
    }
  }

  render() {
    return <div {...this.fetchSelfProps()}/>
  }
}

export default Pin;
