import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Label } from "../Label/Label";
import { Button } from "../Button/Button";
import { Bar } from "../Bar/Bar";
import { Slider } from "../Slider/Slider";

import "./Range.scss";
import { cn } from '../../css';

export class Range extends Slider {

  static className = "Range";

  static customProps = [
    ...Slider.customProps,
    "marker", "label",
  ];

  static defaultFlags = {
    ...Slider.defaultFlags,
    marker:p=>!!p.props.marker
  }

  fetchPropsInterface() { return { className:cn("interface") }}

  fetchPropsTrack() { return { className:cn("track") }}

  fetchPropsBar() {
    const { from, to, min, max, vertical, inverted, marker } = this.props;
    return {
      from, to, min, max, vertical, inverted, marker,
      value:this.getInput()
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return { name, children:label }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchProps()}>
        <div className={cn("wrap")}>
          <Label {...this.fetchPropsLabel()}/>
          <div {...this.fetchPropsInterface()}>
            <div {...this.fetchPropsTrack()}>
              <Bar {...this.fetchPropsBar()}/>
              <button {...this.fetchPropsPin()}/>
            </div>
          </div>
        </div>
        {Component.jet.inject(children, ele=>Button.injectParent(ele, this), true, [Button])}
      </div>
    );
  }
}