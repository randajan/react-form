import React from 'react';


import { useShift } from "../../Hooks";

import css from "./Pin.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);



function Pin (props) {
  const { className, onChange, x, y} = props;
  const [ref, shifting] = useShift({x, y}, onChange);

  const pass = {
    ...props,
    ref,
    className:CN.get("Pin", shifting?"focus":"blur", className)
  }

  delete pass.x;
  delete pass.y;
  delete pass.onChange;
  delete pass.precision;

  return <div {...pass}/>
}

export default Pin;
