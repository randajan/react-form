import React, { Component } from 'react';
import jet from "@randajan/jet-core";

import { Link } from "@randajan/jet-react/dom";
import { usePromise } from '@randajan/jet-react';

import "./Article.scss";
import { compiler } from 'markdown-to-jsx';
import { Tile } from '../Tile/Tile';
import { Block } from '../Block/Block';
import { Img } from '../Img/Img';
import { Caption } from '../Caption/Caption';
import { cn } from '../../css';


const _particles = {
    article: (alt, src, fetch)=><Article src={src} level={alt == null ? 1 : Number.jet.to(alt)} fetch={fetch} />,
    tile: (alt, src)=><Tile alt={null} caption={alt} src={src} />,
    img: (alt, src)=><Img alt={alt} src={src} noSVG/>
}

export const Article = (props) => {
    const { src, className, overrides, fetch, particles } = props;
    const [ article ] = usePromise("", _=>fetch(src), [src]);

    const options = {
        wrapper:null,
        forceWrapper:true,
        overrides: {
            a: Link,
            p: p=><div {...p}/>,
            img: p=>{
                const [kind, src] = String.jet.bite(p.src, "::");
                const prt = (particles ? particles[kind] : null) || _particles[kind];
                return prt ? prt(p.alt, src, fetch) : <Img {...p}/>;
            },
            h1: Caption.h1,
            h2: Caption.h2,
            h3: Caption.h3,
            h4: Caption.h4,
            h5: Caption.h5,
            h6: Caption.h6,
            ...overrides
        }
    }

    const pass = {
        className: cn("Article", className, String.jet.camelCase(String.jet.delone(src || ""))),
        children:compiler(String.jet.to(article), options),
    }

    return <Block {...Component.jet.buildProps(props, pass, ["src", "fetch", "particles", "overrides"])} />;
}
