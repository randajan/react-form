import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper";

import css from "./Pin.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Pin extends Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    xMin: PropTypes.number,
    yMin: PropTypes.number,
    xMax: PropTypes.number,
    yMax: PropTypes.number,
    xStep: PropTypes.number,
    yStep: PropTypes.number,
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

  cleanUp;

  constructor(props) {
    super(props);
    this.state = this.fetchState(Pin.fetchPropState(props));
  }

  fetchState(state) { return state; }

  async setState(state) {
    const { onChange } = this.props;
    const to = this.fetchState(state);
    const changes = jet.obj.compare(this.state, to, true);
    if (changes.length) { await super.setState(to); jet.run(onChange, this, changes); }
    return changes;
  }

  handleShift(ev, bound, state) {
    const { xInverted, yInverted } = this.props;
    const x = Pin.validateX(xInverted ? 1-bound.x : bound.x, this.props);
    const y = Pin.validateY(yInverted ? 1-bound.y : bound.y, this.props);
    bound.x = xInverted ? 1-x : x;
    bound.y = yInverted ? 1-y : y;
    this.setState({ focus:state !== "stop", x, y });
  }

  componentDidMount() {
    this.cleanUp = new jet.RunPool();
    const {x, y, xInverted, yInverted } = this.props;
    const bound = { x:xInverted ? 1-x:x, y:yInverted ? 1-y:y }
    this.cleanUp.add(jet.event.listenShift(this.refs.body, this.handleShift.bind(this), bound))
  }

  componentWillUnmount() {
    this.cleanUp.run();
  }

  componentDidUpdate(props) {
    const to = Pin.fetchPropState(this.props);
    const from = Pin.fetchPropState(props);
    const changes = jet.obj.compare(from, to);
    if (changes.length) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  fetchSelfProps() {
    const { id, title, style, className, flags } = this.props;
    return {
      id, title, style, ref:"body", 
      className:CN.get("Pin", className),
      "data-flag":ClassNames.fetchFlags([Pin.defaultFlags, flags], this).joins(" ")
    }
  }

  render() {
    return <div {...this.fetchSelfProps()}/>
  }
}

export default Pin;
