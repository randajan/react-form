import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Focusable from './Focusable';

function validator(his, fit, on, to, from) {
  if (fit) { to = fit(to, from); }
  to = his.validateValue(to);
  if (on && his.isValueDirty(to, from)) { jet.fce.run(on, his, to, from); }
  return to;
}

class Valuable extends Focusable {
  
  static propTypes = {
    ...Focusable.propTypes,
    fitRawput: PropTypes.func,
    fitOutput: PropTypes.func,
    fitInput: PropTypes.func,
    skipInput: PropTypes.bool
  }

  static defaultFlags = {
    ...Focusable.defaultFlags,
    dirtyOut:p=>p.isOutputDirty(),
    dirtyIn:p=>p.isInputDirty(),
  }

  fetchPropState(props) {
    props = props || this.props;
    let { rawput, output, input} = props;
    output = jet.type.is.full(output) ? output : rawput;
    input = jet.type.is.full(input) ? input : output;
    return { ...super.fetchPropState(props), rawput, output, input };
  }

  isOutputDirty() { return this.state.outputDirty || false; }
  isInputDirty() { return this.state.inputDirty || false; }

  getRawput() { return this.state.rawput; }
  getOutput() { return this.state.output; }
  getInput() { return this.state.input; }

  setRawput(rawput) { this.setState({rawput, output:rawput, input:rawput}); return this.getRawput(); }
  setOutput(output) { this.setState({output, input:output}); return this.getOutput(); }
  setInput(input) { this.setState({input}); return this.getInput(); }

  submit() { return this.setRawput(this.state.output); }
  reject() { return this.setOutput(this.state.rawput); }
  undo() { return this.setInput(this.state.output); }

  blur() { return this.setState({focus:false, output:this.getInput()}); }

  isValueDirty(to, from) {
    return to !== from;
  }

  validateValue(to, from) {
    return to;
  }

  fitValue(to, from, fit, eye) {
    to = this.validateValue(fit ? fit(to, from) : to, from);
    if (eye && this.isValueDirty(to, from)) { this.effect.add(_=>jet.fce.run(eye, this, to, from)); }
    return to;
  }

  validateState(to, from) {
    to = super.validateState(to, from);
    const { fitInput, fitOutput, fitRawput, onInput, onOutput, onRawput, onInputDirty, onOutputDirty, skipInput } = this.props;
    to.rawput = this.fitValue(to.rawput, from.rawput, fitRawput, onRawput);
    
    if (skipInput) { to.output = to.input; }
    to.output = this.fitValue(to.output, from.output, fitOutput, onOutput);
    if (!to.focus) { to.input = to.output; }
    to.input = this.fitValue(to.input, from.input, fitInput, onInput);

    to.outputDirty = this.isValueDirty(to.rawput, to.output);
    to.inputDirty = this.isValueDirty(to.output, to.input);

    if (onOutputDirty && to.outputDirty !== from.outputDirty) {
      this.effect.add(_=>jet.fce.run(onInputDirty, this, to.outputDirty));
    }
    if (onInputDirty && to.inputDirty !== from.inputDirty) {
      this.effect.add(_=>jet.fce.run(onInputDirty, this, to.inputDirty));
    }

    return to;
  }

}

export default Valuable;
