import React from 'react';

import jet from "@randajan/jet-react";

import "./{{pascalCase name}}.scss";
import { cn } from '../../css';




export const {{pascalCase name}} = (props)=>{
  const { id, title, className } = props;

  const selfProps = {
    id, title,
    className:cn("{{pascalCase name}}", className)
  }

  return (
    <div {...selfProps}>

    </div>
  );
}
