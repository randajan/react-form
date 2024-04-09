import React, { Component, useContext } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PropTypes from 'prop-types';

import jet, { RunPool } from '@randajan/jet-core';

import { onDomLoad } from "../../consts";
import { cn } from "../../css";
import { ModalController } from "../../controllers/ModalController";

import { Pop } from '../Pop/Pop';

import "./Modal.scss";
import { Block } from '../Block/Block';

const { solid } = jet.prop;
const context = React.createContext();



export class Modal extends Block {

    static use() { return useContext(context); }

    static className = "Modal";

    static bindMethods = [
        ...Block.bindMethods,
        "buildPop"
    ];
    
    static customProps = [
        ...Block.customProps,
        "children", "list", "closeButton", "closeOnBlur", "transition", "onChange", "onUp", "onDown", "onMount"
    ];

    static defaultProps = {
        ...Block.defaultProps,
        closeButton: "✖",
        closeOnBlur:false,
        transition: 800
    }

    static defaultFlags = {
        ...Block.defaultFlags,
        up: m => m.ctrl.isUp(),
        mounting: p => p.state.mounting,
        modal: p => !p.props.list,
        list: p => p.props.list,
    }

    constructor(props) {
        super(props);

        solid(this, "ctrl", new ModalController());

        this.state = { mounting: true };
    }

    afterMount() {
        onDomLoad(_ => this.setState({ mounting: false }));
    }

    afterRender() {
        const { ctrl, cleanUp, props: { onChange, onUp, onDown } } = this;
        cleanUp.run();
        cleanUp.flush();

        ctrl.current = this;
        cleanUp.add(
            _=>{ if (ctrl.current === this) { delete ctrl.current; } },
            ctrl.onChange.add(_ => this.forceUpdate(), onChange),
            ctrl.onUp.add(onUp),
            ctrl.onDown.add(onDown)
        );
    }

    setState(state) {
        const to = { ...this.state, ...state };
        if (jet.compare(this.state, to)) { return; }
        const { mounting } = this.state;
        super.setState(to);
        if (!to.mounting && mounting) { jet.run(this.props.onMount, this.ctrl); }
    }

    buildPop(pop) {
        const { props } = this;
        const { state } = pop;

        const transition = state.transition || props.transition;
        const closeButton = state.closeButton || props.closeButton;

        return (
            <CSSTransition key={pop.key} timeout={transition} classNames={cn.transitions} appear>
                <Pop {...{ closeButton, ...state }} ctrl={pop} />
            </CSSTransition>
        )
    }

    fetchPropsCover() {
        return {
            className:cn("cover"),
            onClick:({target})=>{ if (target) { this.ctrl.getTop()?.blur(target); } }
        }
    }

    fetchChildren() {
        return (
            <context.Provider value={this.ctrl}>
                {super.fetchChildren()}
                <div {...this.fetchPropsCover()}>
                    <div className={cn("mist")} />
                    <TransitionGroup className={cn("pops")}>
                        {Array.from(this.ctrl.pops.up).map(this.buildPop)}
                    </TransitionGroup>
                </div>
            </context.Provider>
        );
    }

}
