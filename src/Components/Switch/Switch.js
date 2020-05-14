import React, { useState } from "react";

import jet from "@randajan/jetpack";

import Track from "../Track/Track";
import Label from "../Label/Label";

import css from "./Switch.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

function Switch(props) {
    let { name, label, value, onChange, downend, vertical } = props;
    [label, name, value] = jet.get([["string", label], ["string", name, jet.str.simplify(label)], ["boolean", value]]);

    const [state, setState] = useState(value);

    const pass = {
        ...props,
        className:CN.get("Switch", vertical?"vertical":"horizontal", state?"on":"off"),
        onClick:_=>setState(!state),
    }

    delete pass.name;
    delete pass.label;
    delete pass.value;
    delete pass.vertical;
    delete pass.downend;
    delete pass.onChange;

    return (
        <div {...pass}>
            <Label className={CN.pass("Label")}>{label}</Label>
            <Track className={CN.pass("Track")} to={1} value={+state} onChange={onChange} downend={downend} vertical={vertical}/>
            <input type="checkbox" checked={state} name={name} readOnly/>
        </div>
    )
}

export default Switch;