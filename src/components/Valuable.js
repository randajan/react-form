import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Focusable } from './Focusable';

export class Valuable extends Focusable {

  static customProps = [
    ...Focusable.customProps,
    "rawput", "output", "input",
    "fitOutput", "fitInput", "skipInput", "onInput", "onOutput", "onInputDirty", "onOutputDirty",
  ];
  
  static propTypes = {
    ...Focusable.propTypes,
    fitOutput: PropTypes.func,
    fitInput: PropTypes.func,
    skipInput: PropTypes.bool
  }

  static defaultFlags = {
    ...Focusable.defaultFlags,
    dirtyOut:p=>p.isOutputDirty(),
    dirtyIn:p=>p.isInputDirty(),
  }

  static stateProps = [
    ...Focusable.stateProps,
    "rawput", "output", "input",
  ];


  fetchPropState(props) {
    let { rawput, output, input} = props;
    output = jet.isFull(output) ? output : rawput;
    input = jet.isFull(input) ? input : output;
    return { ...super.fetchPropState(props), rawput, output, input };
  }

  isOutputDirty() { return this.state.outputDirty || false; }
  isInputDirty() { return this.state.inputDirty || false; }

  getRawput() { return this.state.rawput; }
  getOutput() { return this.state.output; }
  getInput() { return this.state.input; }

  setRawput(rawput) { this.setState({ rawput }); return this.getRawput(); }
  setOutput(output) { this.setState({ output }); return this.getOutput(); }
  setInput(input) { this.setState({ input }); return this.getInput(); }

  submit() { this.setRawput(this.state.output); return true; }
  reject() { this.setOutput(this.state.rawput); return true; }
  undo() { this.setInput(this.state.output); return true; }

  blur() { return this.setState({focus:false, output:this.getInput()}); }

  isValueDirty(to, from) {
    return to !== from;
  }

  validateValue(to, from, force=false) {
    return to;
  }

  fitValue(to, from, fit, eye, force=false) {
    to = this.validateValue(fit ? fit(to, from) : to, from, force);
    if (eye && this.isValueDirty(to, from)) { this.effect.add(_=>jet.run(eye, this, to, from)); }
    return to;
  }

  validateState(to, from) {
    const { fitInput, fitOutput, onInput, onOutput, onInputDirty, onOutputDirty, skipInput } = this.props;
    
    to = super.validateState(to, from);
    
    to.rawput = this.validateValue(to.rawput, from.rawput, true);

    if (to.focus) { to.input = this.fitValue(to.input, from.input, fitInput, onInput, false); }
    
    if (this.isValueDirty(from.rawput, to.rawput)) { to.output = to.rawput; }
    else if (skipInput && to.focus) { to.output = to.input; }

    to.output = this.fitValue(to.output, from.output, fitOutput, onOutput, true);
    
    if (!to.focus) { to.input = this.fitValue(to.output, from.input, fitInput, onInput, false); }
    
    to.outputDirty = this.isValueDirty(to.rawput, to.output);
    to.inputDirty = this.isValueDirty(to.output, to.input);

    if (onOutputDirty && to.outputDirty !== from.outputDirty) {
      this.effect.add(_=>jet.run(onOutputDirty, this, to.outputDirty));
    }
    if (onInputDirty && to.inputDirty !== from.inputDirty) {
      this.effect.add(_=>jet.run(onInputDirty, this, to.inputDirty));
    }

    return to;
  }

}
