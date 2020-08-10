import React, { useState, useEffect } from 'react';


import Checker from "./Helpers/Checker";

function useChecker(check) {
  const dynamic = useState({})[0];
  dynamic.check = check;
  useEffect(_=>{
    const check = _=>dynamic.check();
    Checker.list.add(check); return _=>Checker.list.rem(check);
  }, []);
}

export {
  useChecker
}