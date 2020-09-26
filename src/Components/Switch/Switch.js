import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Valuable from '../../Dummy/Valuable';

import Label from "../Label/Label";
import Button from "../Button/Button";
import Bar from "../Bar/Bar";
import Slider from "../Slider/Slider";

import cssfile from "./Switch.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Switch extends Valuable {

  static propTypes = {
    ...Valuable.propTypes,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool,
  }

  static defaultProps = {
    ...Valuable.defaultProps,
    inverted:false,
    vertical:false,
  }

  static defaultFlags = {
    vertical:p=>p.props.vertical,
    inverted:p=>p.props.inverted,
    shifting:p=>p.state.shifting,
    on:p=>p.state.input,
    off:p=>!p.state.input
  }
  
  static validateValue(props, value) { return jet.to("boolean", value); }

  draw() {
    if (!this.slider) { return; }
    const { focus, rawput, output, input, lock } = this.state;
    this.slider.setState({focus, rawput, output, input, lock});
  }

  async tap() {
    await this.setState({focus:true, input:!this.state.input});
    return this.getInput();
  }

  fetchPropsInterface() {
    return {
      className:css.get("interface"),
      onMouseDown:ev=>{this.tap(); jet.event.stop(ev, true);}
    }
  }

  fetchPropsBar() {
    const { vertical, inverted } = this.props;
    const { input } = this.state;
    return { vertical, inverted, value:+input, className:css.get("Bar") }
  }

  fetchPropsSlider() {
    const { inverted, vertical, nofocus, noblur } = this.props;

    return {
      ref:el=>this.slider=el, style:{pointerEvents:"none"},
      step:1, inverted, vertical, nofocus, noblur,
      onChange:(slider)=>this.setState(slider.state)
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
          <div {...this.fetchPropsInterface()}>
            <div className={css.get("track")}>
              <Bar {...this.fetchPropsBar()}/>
              <Slider {...this.fetchPropsSlider()}/>
            </div>
          </div>
        </div>
        {jet.react.injectProps(children, ele=>Button.injectParent(ele, this), true, Button)}
      </div>
    );
  }
}

export default Switch;
