import React from 'react';

import "./Label.scss";
import { cn } from '../../css';


//LABEL

function Label(props) {
  const { className, children, name } = props;

  if (!children) { return null; }
  
  return (
    <label className={cn("Label", className)} htmlFor={name}>
      {children}
    </label>
  )
}

export default Label;