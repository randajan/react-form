import React from 'react';


import jet from "@randajan/jetpack";


import "./Label.scss";

//LABEL

function Label(props) {
  const { className, children, name } = props;
  return <label className={jet.obj.join(["Label", className], " ")} htmlFor={name}>{children}</label>
}

export default Label;