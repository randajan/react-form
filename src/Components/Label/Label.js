import React from 'react';

import "./Label.scss";
import { cns } from '../../consts';


//LABEL

function Label(props) {
  const { className, children, name } = props;
  
  return !children ? null : (
    <label className={cns("Label", className)} htmlFor={name}>
      {children}
    </label>
  )
}

export default Label;