import React, { Component, useContext } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PropTypes from 'prop-types';

import jet, { RunPool } from '@randajan/jet-core';

import { onDomLoad } from "../../consts";
import { cn } from "../../css";
import { ModalController } from "../../controllers/ModalController";

import "./Modal.scss";
import { Pop } from '../Pop/Pop';

const { solid } = jet.prop;
const context = React.createContext();

export class Modal extends Component {

    static use() { return useContext(context); }

    static className = "Modal";

    static propTypes = {
        flags: PropTypes.object,
    }

    static defaultProps = {
        flags: {},
        closeButton:"✖",
        transition:800
    }

    static customProps = ["children", "flags", "list", "closeButton", "transition", "onChange", "onUp", "onDown", "onMount"];

    static defaultFlags = {
        up: m => m.ctrl.isUp(),
        mounting: p => p.state.mounting,
        modal: p => !p.props.list,
        list: p => p.props.list,
    }

    constructor(props) {
        super(props);

        solid.all(this, {
            self: this.constructor,
            ctrl: new ModalController(this),
            cleanUp: new RunPool(),
            buildPop:this.buildPop.bind(this)
        });

        this.state = { mounting: true };
    }

    changeStatus(status) {
        this.cleanUp.run();
        this.cleanUp.flush();
        if (status === false) { return; }
        if (status === true) { onDomLoad(_ => this.setState({ mounting: false })); }

        const { onChange, onUp, onDown } = this.props;
        this.cleanUp.add(
            this.ctrl.onChange.add(_ => this.forceUpdate(), onChange),
            this.ctrl.onUp.add(onUp),
            this.ctrl.onDown.add(onDown)
        );
    }

    componentDidMount() { this.changeStatus(true); }
    componentDidUpdate() { this.changeStatus(); }
    componentWillUnmount() { this.changeStatus(false); }

    setState(state) {
        const to = { ...this.state, ...state };
        if (jet.compare(this.state, to)) { return; }
        const { mounting } = this.state;
        super.setState(to);
        if (!to.mounting && mounting) { jet.run(this.props.onMount, this.ctrl); }
    }

    fetchProps() {
        const { props, self: { className, customProps, defaultFlags } } = this;

        return Component.jet.buildProps(props, {
            ref: body => this.body = body,
            className: cn(className, props.className),
            "data-flags": Component.jet.flags({ ...defaultFlags, ...props.flags }, this)
        }, customProps);

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

    render() {
        return (
            <context.Provider value={this.ctrl}>
                <div {...this.fetchProps()}>
                    {this.props.children}
                    <div className={cn("cover")}>
                        <div className={cn("mist")} />
                        <TransitionGroup className={cn("pops")}>
                            {Array.from(this.ctrl.pops.up).map(this.buildPop)}
                        </TransitionGroup>
                    </div>
                </div>
            </context.Provider>
        );
    }


}
