import React, { useRef, useEffect, useState } from "react";

import jet from "@randajan/jetpack";

import Pin from "../Pin/Pin";

import "./Track.scss";

function invert(bol, value) {
  return bol ? 1-value : value;
}

function Track(props) {
    let { vertical, onChange, className, step, from, to, downend, value } = props;
    const [shifting, setShifting] = useState();
    const mark = useRef();

    [downend, vertical, from, to, value] = jet.get([["boolean", downend], ["boolean", vertical], ["number", from], ["number", to, 100], ["number", value]]);

    value = invert(downend, jet.num.toRatio(value, from, to));
    step = (1/Math.max(0, jet.get("number", step, to-from+1)-1)) || 0;

    const pass = {
      ...props,
      className:jet.obj.join(["Track", shifting?"shifting":"static", vertical?"vertical":"horizontal", downend?"downend":"upend", className], " "),
    }

    delete pass.vertical;
    delete pass.onChange;
    delete pass.step;
    delete pass.downend;
    delete pass.value;

    return (
        <div {...pass}>
            <div className="path">
              <div className="rail">
                <div ref={mark} className="mark"/>
              </div>
              <Pin x={vertical?.5:value} y={vertical?value:.5} onChange={(bound, state)=>{
                if (state !== "shift") { setShifting(state==="start"); }
                const stp = state === "shift" ? .001 : step;

                bound.x = vertical ? .5 : jet.num.snap(bound.x, stp, 0, 1);
                bound.y = vertical ? jet.num.snap(bound.y, stp, 0, 1) : .5;

                const value = invert(downend, vertical ? bound.y : bound.x);
                mark.current.style[vertical?"height":"width"] = (value*100)+"%";

                if (state === "stop" && jet.is("function", onChange)) { 
                  onChange(jet.num.fromRatio(value, from, to)); 
                }
              }}/>
            </div>
        </div>
    )
}

export default Track;
