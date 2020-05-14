import React, { useState, useEffect, useRef } from 'react';

import jet from "@randajan/jetpack";

import Checker from "./Helpers/Checker";

function useChecker(check) {
  const dynamic = useState({})[0];
  dynamic.check = check;
  useEffect(_=>{
    const check = _=>dynamic.check();
    Checker.list.add(check); return _=>Checker.list.rem(check);
  }, []);
}

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

export {
  useChecker,
  useShift
}