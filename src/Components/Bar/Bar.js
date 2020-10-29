import React from 'react';
import PropTypes from 'prop-types';

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Bar.scss";
import csslib from "../../css";

class Bar extends Flagable {

  static css = csslib.open(cssfile);
  static className = "Bar";

  static propTypes = {
    ...Flagable.propTypes,
    value: PropTypes.number,
  }

  static defaultProps = {
    ...Flagable.defaultProps,
    value: 0,
  }

  static defaultFlags = {
    inverted:p=>p.props.inverted,
    vertical:p=>p.props.vertical
  }

  fetchPropsMark() {
    const { vertical, inverted, value } = this.props;
    const stickTo = vertical ? (inverted ? "bottom" : "top") : (inverted ? "right" : "left");
    return {
      className:Bar.css.get("mark"),
      style:{
        width:(vertical?1:value)*100+"%",
        height:(vertical?value:1)*100+"%",
        pointerEvents:"none",
        [stickTo]:0
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchPropsSelf()}>
        <div {...this.fetchPropsMark()}/>
        {children ? <div className={Bar.css.get("caption")}>{children}</div>: null}
      </div>
    );
  }
}

export default Bar;
