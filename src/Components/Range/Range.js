import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Label from "../Label/Label";
import Button from "../Button/Button";
import Bar from "../Bar/Bar";
import Slider from "../Slider/Slider";

import cssfile from "./Range.scss";
import csslib from "../../css";

class Range extends Slider {

  static css = csslib.open(cssfile, Slider.css);
  static className = "Range";

  static defaultFlags = {
    ...Slider.defaultFlags,
    marker:p=>!!p.props.marker
  }

  fetchPropsInterface() { return { className:this.css.get("interface") }}

  fetchPropsTrack() { return { className:this.css.get("track") }}

  fetchPropsBar() {
    const { from, to, min, max, vertical, inverted, marker } = this.props;
    return {
      from, to, min, max, vertical, inverted, marker,
      value:this.valueToRatio(this.getInput()), className:this.css.get("Bar")
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return { className:this.css.get("Label"), name, children:label }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchPropsSelf()}>
        <div className={this.css.get("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div {...this.fetchPropsInterface()}>
            <div {...this.fetchPropsTrack()}>
              <Bar {...this.fetchPropsBar()}/>
              <button {...this.fetchPropsPin()}/>
            </div>
          </div>
        </div>
        {jet.react.injectProps(children, ele=>Button.injectParent(ele, this), true, Button)}
      </div>
    );
  }
}

export default Range;
