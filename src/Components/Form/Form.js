import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import css from "./Form.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Form extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  submit(ev) {
    const onSubmit = this.props.onSubmit;
    if (onSubmit) {
      jet.event.stop(ev);
      onSubmit(this);
    }
  }

  serialize() {
    const data = {};
    for (let field of new FormData(this.refs.body).entries()) { data[field[0]] = field[1]; }
    return data;
  }

  render() {
    const { className } = this.props;
    return (
      <form ref="body" {...this.props} onSubmit={ev=>this.submit(ev)} className={CN.get(["Form", className])}>
        {this.props.children}
      </form>
    )
  }
}


export default Form;




