import React from "react";
import jet from "@randajan/jet-core";


export let cn = c=>c;
export const cns = (...c)=>jet.melt(c.map(cn), " ");
export const cssTranslate = translator=>{ if (jet.isRunnable(translator)) { cn = translator; } }