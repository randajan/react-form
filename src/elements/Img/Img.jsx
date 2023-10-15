import React, { useEffect, useRef } from 'react';

import page from '@randajan/jet-react/page';
import { usePromise } from '@randajan/jet-react';

import { cn } from "../../css";

import "./Img.scss";

const _rgExt = /\.[^\/\\]*$/;
const _rgSvg = /<svg[^>]*>[\s\S]*<\/svg>/;
const _cache = {};


const Svg = (props)=>{
    const { alt, src } = props;
    const body = useRef();

    const [ svg ] = usePromise(null, async _=>{
        if (_cache[src]) { return _cache[src]; }
        const resp = await fetch(src);
        const data = await resp.text();
        if (typeof data !== "string" || !_rgSvg.test(data)) { return; }
        return _cache[src] = data;
    }, [src]);
    
    useEffect(_=>{ if (body.current && svg != null) { body.current.innerHTML = svg; } }, [svg, body?.current]);
    
    return <span ref={body} className={cn("Img", props.className)}>{svg == null ? alt : null}</span>;
}


export const Img = (props)=>{
    const origin = page.get("origin");
    const url = new URL(props.src, origin);
    const ext = (url?.pathname?.match(_rgExt) || [])[0];

    return ext === ".svg" ? <Svg {...props}/> : <img {...props} className={cn("Img", props.className)}/>;
}

