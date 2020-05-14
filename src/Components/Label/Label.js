import React from 'react';

import css from "./Label.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


//LABEL

function Label(props) {
  const { className, children, name } = props;
  return <label className={CN.get("Label", className)} htmlFor={name}>{children}</label>
}

export default Label;