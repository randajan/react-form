import React from "react";





export const fetchProps = props => (String.jet.is(props) || React.isValidElement(props)) ? { children: props } : Object.jet.tap(props);

export const onDomUpdate = callback=>{ setTimeout(window.requestAnimationFrame(callback)); }
export const onDomLoad = callback=>document.readyState === 'complete' ? onDomUpdate(callback) : window.addEventListener('load', _ => onDomUpdate(callback));