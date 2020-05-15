import React from 'react';


import jet from "@randajan/jetpack";

import Field from "../Field/Field";

import Proper from "../../Helpers/Proper";


import css from "./Group.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


function Group (props) {
  let { id, title, className, fields } = props;

  const selfProps = {
    id, title,
    className:CN.get("Group", className)
  }

  const passProps = Proper.pass(props, {}, {id, className, title, fields});
  
  return (
    <div {...selfProps}>
      {
        Object.entries(fields).map(k=>{
          const props = jet.get("object", k[1], { label:k[1] });
          const name = isNaN(Number(k[0])) ? k[0] : "";
          return <Field key={k[0]} {...passProps} name={name} {...props}/>
        })
      }
    </div>
  );
}

export default Group;
