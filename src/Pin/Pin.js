import React, { useState, useEffect, useRef} from 'react';

import jet from "@randajan/jetpack";
//import { useShift } from "../Hooks";

function useShift(initial, onChange) {
  const [shifting, setShifting] = useState(false);
  const ref = useRef();
  initial = jet.get("object", initial);
    
  useEffect(_=>jet.event.listenShift(ref.current, (ev, bound, state)=>{
      if (state !== "shift") {setShifting( state === "start");}     
      jet.run(onChange, bound, state);
  }, initial), [ref.current, initial.x, initial.y]);

  return [ref, shifting];
}

import "./Pin.scss";

function Pin (props) {
  const { className, onChange, x, y} = props;
  const [ref, shifting] = useShift({x, y}, onChange);

  const pass = {
    ...props,
    ref,
    className:jet.obj.join(["Pin", shifting?"shifting":"static", className], " ")
  }

  delete pass.x;
  delete pass.y;
  delete pass.onChange;
  delete pass.precision;

  return <div {...pass}/>
}

export default Pin;
