import React from 'react';


import jet from "@randajan/jetpack";


import css from "./{{pascalCase name}}.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


function {{pascalCase name}} (props) {
  const { className } = props;

  const pass = {
    className:CN.get("{{pascalCase name}}", className)
  }

  return (
    <div {...pass}>

    </div>
  );
}

export default {{pascalCase name}};
