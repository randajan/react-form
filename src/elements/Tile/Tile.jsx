import React from 'react';

import "./Tile.scss";

import { Block } from '../Block/Block';
import { Img } from '../Img/Img';
import { Caption } from '../Caption/Caption';
import { cn } from '../../css';


export const Tile = (props)=>{
    const { src, caption, children, className } = props
  
    return (
      <Block {...props} src={null} caption={null} className={cn("Tile", className)}>
        <Img src={src}/>
        <Caption>{caption}</Caption>
        {children}
      </Block>
    )
}

