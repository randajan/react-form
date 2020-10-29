import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Focusable from './Focusable';

function validator(his, fit, on, to, from) {
  if (fit) { to = fit(to, from); }
  to = his.validateValue(to);
  if (on && his.isValueDirty(to, from)) { jet.run(on, his, to, from); }
  return to;
}

class Valuable extends Focusable {

  static syncValueOnBlur = true;
  
  static propTypes = {
    ...Focusable.propTypes,
    fitRawput: PropTypes.func,
    fitOutput: PropTypes.func,
    fitInput: PropTypes.func,
  }

  static defaultFlags = {
    ...Focusable.defaultFlags,
    dirtyOut:p=>p.isOutputDirty(),
    dirtyIn:p=>p.isInputDirty(),
  }

  fetchPropState(props) {
    props = props || this.props;
    const { rawput, output, input} = props;
    return {
      ...super.fetchPropState(props),
      rawput:this.validateValue(rawput, undefined, "rawput"), 
      output:this.validateValue(jet.get("full", output, rawput), undefined, "output"),
      input:this.validateValue(jet.get("full", input, output, rawput), undefined, "input")
    };
  }

  isOutputDirty() { return this.state.outputDirty || false; }
  isInputDirty() { return this.state.inputDirty || false; }

  getRawput() { return this.state.rawput; }
  getOutput() { return this.state.output; }
  getInput() { return this.state.input; }

  async setRawput(rawput) { await this.setState({rawput, output:rawput, input:rawput}); return this.getRawput(); }
  async setOutput(output) { await this.setState({output, input:output}); return this.getOutput(); }
  async setInput(input) { await this.setState({input}); return this.getInput(); }

  submit() { return this.setRawput(this.state.output); }
  reject() { return this.setOutput(this.state.rawput); }
  undo() { return this.setInput(this.state.output); }

  blur() { return this.setState({focus:false, output:this.getInput()}); }

  isValueDirty(to, from) {
    return to !== from;
  }

  validateValue(to, from, kind) {
    return to;
  }

  fitValue(to, from, fit, eye, kind) {
    to = this.validateValue(fit ? fit(to, from) : to, from, kind);
    if (eye && this.isValueDirty(to, from)) { setTimeout(_=>jet.run(eye, this, to, from)); }
    return to;
  }

  validateState(to, from) {
    to = super.validateState(to, from);
    const { fitInput, fitOutput, fitRawput, onInput, onOutput, onRawput, onInputDirty, onOutputDirty } = this.props;
    const self = this.constructor;

    to.rawput = this.fitValue(to.rawput, from.rawput, fitRawput, onRawput, "rawput");
    to.output = this.fitValue(to.output, from.output, fitOutput, onOutput, "output");
    if (self.syncValueOnBlur && !to.focus) { to.input = to.output; }
    to.input = this.fitValue(to.input, from.input, fitInput, onInput, "input");

    to.outputDirty = this.isValueDirty(to.rawput, to.output);
    to.inputDirty = this.isValueDirty(to.output, to.input);

    if (onOutputDirty && to.outputDirty !== from.outputDirty) { jet.run(onInputDirty, this, to.outputDirty); }
    if (onInputDirty && to.inputDirty !== from.inputDirty) { jet.run(onInputDirty, this, to.inputDirty); }

    return to;
  }

}

export default Valuable;
