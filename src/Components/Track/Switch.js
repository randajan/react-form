import React, { Component } from "react";

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper";

import Track from "./Track";

import css from "./Track.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Switch extends Component {

    fetchSelfProps() {
        const { vertical } = this.props;
        return Proper.pass(this.props,
            {
                className:CN.get("Switch"),
                to:1, from:0, step:1,
                onClick:_=>this.refs.track.setInput(+(!this.refs.track.state.output))
            }, {}
        )
    }

    render() {
        return (
            <Track ref="track" {...this.fetchSelfProps()}/>
        )
    }
}


export default Switch;