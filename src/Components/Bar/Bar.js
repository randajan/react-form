import React from 'react';
import PropTypes from 'prop-types';

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Bar.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Bar extends Flagable {

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
      className:css.get("mark"),
      style:{
        width:(vertical?1:value)*100+"%",
        height:(vertical?value:1)*100+"%",
        [stickTo]:0
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchPropsSelf(css)}>
        <div {...this.fetchPropsMark()}/>
        {children ? <div className={css.get("caption")}>{children}</div>: null}
      </div>
    );
  }
}

export default Bar;
