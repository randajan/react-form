import React from 'react';
import PropTypes from 'prop-types';

import Focusable from './Focusable';

function validator(self, his, fit, on, to, from) {
  if (fit) { to = fit(to, from); }
  to = self.validateValue(his.props, to);
  if (on && self.isValueDirty(to, from)) { jet.run(on, his, to, from); }
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

  static isValueDirty(to, from) {
    return to !== from;
  }

  static validateValue(props, value) {
    return value;
  }

  static fetchPropState(props, self) {
    const { rawput, output, input} = props;
    return {
      ...Focusable.fetchPropState(props, self),
      rawput:self.validateValue(props, rawput), 
      output:self.validateValue(props, jet.get("full", output, rawput)),
      input:self.validateValue(props, jet.get("full", input, output, rawput))
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

  blur() { return this.setState({focus:false, output:this.getInput()}); }

  validateState(to, from) {
    to = super.validateState(to, from);
    const { fitInput, fitOutput, fitRawput, onInput, onOutput, onRawput, onInputDirty, onOutputDirty } = this.props;
    const self = this.constructor;

    to.rawput = validator(self, this, fitRawput, onRawput, to.rawput, from.rawput);
    to.output = validator(self, this, fitOutput, onOutput, to.output, from.output);
    if (self.syncValueOnBlur && !to.focus) { to.input = to.output; }
    else { to.input = validator(self, this, fitInput, onInput, to.input, from.input); }

    to.outputDirty = self.isValueDirty(to.rawput, to.output);
    to.inputDirty = self.isValueDirty(to.output, to.input);

    if (onOutputDirty && to.outputDirty !== from.outputDirty) { jet.run(onInputDirty, this, to.outputDirty); }
    if (onInputDirty && to.inputDirty !== from.inputDirty) { jet.run(onInputDirty, this, to.inputDirty); }

    return to;
  }

}

export default Valuable;
