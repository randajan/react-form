import React, { Component } from 'react';
import jet from "@randajan/jet-core";

import { Block } from "../Block/Block";
import { cn } from '../../css';

const { solid } = jet.prop;

const _customProps = ["level"];

export const Caption = (props)=>{
    const { className, children, level } = props;
    const lvl = Block.use() + Math.max(1, Math.round(level || 1));

    const Tag = lvl > 6 ? "span" : "h"+lvl;

    return (
        <Tag {...Component.jet.buildProps(props, { className:cn("Caption", className), "data-flags":lvl}, _customProps)}>
            {children}
        </Tag>
    )
}



for (let i=1; i<=6; i++) {
    solid(Caption, "h"+i, props=><Caption {...props} level={i}/>);
}
  
