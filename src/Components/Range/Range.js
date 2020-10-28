import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Valuable from '../../Dummy/Valuable';

import Label from "../Label/Label";
import Button from "../Button/Button";
import Bar from "../Bar/Bar";
import Slider from "../Slider/Slider";

import cssfile from "./Range.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Range extends Valuable {

  static className = "Range";

  static propTypes = {
    ...Valuable.propTypes,
    from: PropTypes.number,
    to: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool,
    autoSubmit: PropTypes.boolean
  }

  static defaultProps = {
    ...Valuable.defaultProps,
    from: 0,
    to: 1,
    step: 0.01,
    inverted:false,
    vertical:false,
  }

  static defaultFlags = {
    ...Valuable.defaultFlags,
    vertical:p=>p.props.vertical,
    inverted:p=>p.props.inverted,
    shifting:p=>p.state.shifting,
  }
  
  static validateValue(props, value) {
    const { min, max, from, to, step } = props;
    const val = jet.num.to(value);
    return step ? jet.num.snap(val, step, min||from, max||to) : jet.num.frame(val, min||from, max||to);
  }

  static valueToRatio(props, value) { return jet.filter("full", jet.num.toRatio(value, props.from, props.to)); }
  static ratioToValue(props, ratio) { return jet.filter("full", jet.num.fromRatio(ratio, props.from, props.to)); }
  static valuesToRatios(props, values) { return jet.obj.map(values, val=>Range.valueToRatio(props, val)); }
  static ratiosToValues(props, ratios) { return jet.obj.map(ratios, val=>Range.ratioToValue(props, val)); }

  draw() {
    if (!this.slider) { return; }
    const { focus, rawput, output, input, lock } = this.state;
    this.slider.setState({focus, lock, ...Range.valuesToRatios(this.props, {rawput, output, input})});
  }

  validateState(to, from) {
    if (to.shifting) { to.focus = true; }
    return super.validateState(to, from);
  }

  fetchBarProps() {
    const { vertical, inverted } = this.props;
    const { input } = this.state;
    return { vertical, inverted, value:Range.valueToRatio(this.props, input), className:css.get("Bar") }
  }

  fetchSliderProps() {
    const { from, min, max, step, inverted, vertical, autoSubmit } = this.props;
    return {
      ref:el=>this.slider=el, inverted, vertical, autoSubmit,
      ...Range.valuesToRatios(this.props, {step:from+step, min, max}),
      onChange:(slider)=>{
        const { rawput, output, input } = slider.state;
        this.setState({ ...slider.state, ...Range.ratiosToValues(this.props, { rawput, output, input})})
      }
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return {
      className:css.get("Label"), name,
      children:label
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchPropsSelf(css)}>
        <div className={css.get("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div className={css.get("interface")}>
            <div className={css.get("track")}>
              <Bar {...this.fetchBarProps()}/>
              <Slider {...this.fetchSliderProps()}/>
            </div>
          </div>
        </div>
        {jet.react.injectProps(children, ele=>Button.injectParent(ele, this), true, Button)}
      </div>
    );
  }
}

export default Range;
