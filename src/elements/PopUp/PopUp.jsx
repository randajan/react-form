import React, { useEffect } from 'react';
import { usePop } from '../../hooks/usePop';


export const PopUp = props=>{
  const pop = usePop(props);
  useEffect(_=>{ pop.up(props); });
  return null;
}
