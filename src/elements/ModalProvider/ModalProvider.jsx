import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import jet, { RunPool } from '@randajan/jet-core';

import { ModalProviderFlagsDefault, popFlagsDefault, onDomLoad } from "../../consts";
import { cn } from "../../css";
import { Modal } from "../../class/Modal";

import "./ModalProvider.scss";

const { solid } = jet.prop;

const ModalProviderPropsExtra = ["children", "flags", "list", "closeButton", "transition", "onChange", "onUp", "onDown", "onMount"];

export const contextModal = React.createContext();

export class ModalProvider extends Component {

    constructor(props) {
        super(props);

        solid.all(this, {
            modal: new Modal(this),
            cleanUp: new RunPool()
        });

        this.state = { mounting: true };
    }

    changeStatus(status) {
        this.cleanUp.run();
        this.cleanUp.flush();
        if (status === false) { return; }
        if (status === true) { onDomLoad(_ => this.setState({ mounting: false }) ); }

        const { onChange, onUp, onDown } = this.props;
        this.cleanUp.add(
            this.modal.onChange.add(_ => this.forceUpdate(), onChange),
            this.modal.onUp.add(onUp),
            this.modal.onDown.add(onDown)
        );
    }

    componentDidMount() { this.changeStatus(true); }
    componentDidUpdate() { this.changeStatus(); }
    componentWillUnmount() { this.changeStatus(false); }

    setState(state) {
        const to = { ...this.state, ...state };
        if (jet.compare(this.state, to)) {return; }
        const { mounting } = this.state;
        super.setState(to);
        if (!to.mounting && mounting) { jet.run(this.props.onMount, this.modal); }
    }

    fetchProps() {
        const { className, flags } = this.props;

        const props = jet.map(this.props, (v, k)=>{ if (!ModalProviderPropsExtra.includes(k)) { return v; } });

        return Object.assign(props, {
            ref: body => this.body = body,
            className: jet.melt([cn("Modal"), className], " "),
            "data-flags": Component.jet.flags({ ...ModalProviderFlagsDefault, ...flags }, this)
        })
    }


    fetchPop(pop) {
        const { id, className, title, flags, lock, children, transition, closeButton } = pop.state;
        const { props } = this;

        const tr = Number.jet.tap(transition, props.transition, 800);
        const cb = closeButton || props.closeButton || "✖";

        return (
            <CSSTransition key={pop.key} timeout={tr} classNames={cn.transitions} appear>
                <div {...{
                    id, title, className: jet.melt([cn("Pop"), className], " "),
                    "data-flags": Component.jet.flags({ ...popFlagsDefault, ...flags }, pop)
                }}>
                    <nav className={cn("nav")}>
                        <div className={cn("close")} onClick={lock ? null : pop.down.bind(pop)}>{cb}</div>
                    </nav>
                    <div className={cn("content")}>
                        {children}
                    </div>
                    <div className={cn("mist")} />
                </div>
            </CSSTransition>
        )
    }

    render() {
        return (
            <contextModal.Provider value={this.modal}>
                <div {...this.fetchProps()}>
                    { this.props.children }
                    <div className={cn("cover")}>
                        <div className={cn("mist")} />
                        <TransitionGroup className={cn("pops")}>
                            { Array.from(this.modal.pops.up).map(this.fetchPop.bind(this)) }
                        </TransitionGroup>
                    </div>
                </div>
            </contextModal.Provider>
        );
    }
}
