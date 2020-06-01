import React from 'react';


import jet from "@randajan/jetpack";


import css from "./{{pascalCase name}}.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


function {{pascalCase name}} (props) {
  const { id, title, className } = props;

  const selfProps = {
    id, title,
    className:CN.get("{{pascalCase name}}", className)
  }

  return (
    <div {...selfProps}>

    </div>
  );
}

export default {{pascalCase name}};
