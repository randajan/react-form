import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from "./Form.scss";


class Form extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  submit(ev) {
    const onSubmit = this.props.onSubmit;
    const form = ev.target;
    if (onSubmit) {
      ev.preventDefault();
      onSubmit(form);
    }
  }

  render() {
    return (
      <form {...this.props} onSubmit={ev=>this.submit(ev)}>
        {this.props.children}
      </form>
    )
  }
}


export default Form;




