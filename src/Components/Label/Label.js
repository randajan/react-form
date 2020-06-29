import React from 'react';

import cssfile from "./Label.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);


//LABEL

function Label(props) {
  const { className, children, name } = props;
  
  return !children ? null : (
    <label className={css.get("Label", className)} htmlFor={name}>
      {children}
    </label>
  )
}

export default Label;