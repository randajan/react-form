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

function useShift(initial, onChange, deps) {
  const [shifting, setShifting] = useState(false);
  const ref = useRef();
  initial = jet.get("object", initial);
  deps = jet.arr.wrap(deps);
  deps.push(ref.current, initial.x, initial.y)
    
  useEffect(_=>jet.event.listenShift(ref.current, (ev, bound, state)=>{
    if (state !== "shift") {setShifting( state === "start");}     
    jet.run(onChange, bound, state);
  }, initial), deps);

  return [ref, shifting];
}

export {
  useChecker,
  useShift
}