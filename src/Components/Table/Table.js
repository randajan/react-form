import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Table.scss";
import csslib from "../../css";

class Table extends Flagable {

  static css = csslib.open(cssfile);
  static className = "Table";

  static propTypes = {
    ...Flagable.propTypes,
    "rows":PropTypes.array,
    "columns":PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  static defaultProps = {
    ...Flagable.defaultProps,
    "rows":[],
    "columns":[]
  }
  
  headings = {};

  draft() {
    this.cleanUp.add(jet.ele.listen(window, "resize", this.refreshSize.bind(this)));
    this.cleanUp.add(jet.ele.listen(this.rows, "scroll", this.refreshScroll.bind(this)));
  }

  draw() {
    this.refreshSize();
  }

  refreshScroll() {
    const { columns, rows } = this;
    if (!columns || !rows) { return; }
    columns.scrollLeft = rows.scrollLeft;
    columns.style.width = rows.clientWidth + "px";
  }

  refreshSize() {
    this.refreshScroll();
    jet.map.it(this.headings, th=>{
      th.real.style.width = th.dummy.offsetWidth + "px";
    });
  }

  thRef(el, col, dummy) {
    jet.map.put(this.headings, [col, dummy ? "dummy":"real"], el);
  }

  heading(dummy) {
    const { columns } = this.props;
    return jet.map.it(columns, (children, key)=>{
      const prop = { key, children, ref:el=>this.thRef(el, key, dummy) };
      return <th {...prop}/>;
    });
  }

  fetchPropsColumns() {
    return {
      ref:el=>this.columns = el,
      className:this.css.get("columns"),
      children:this.heading(false)
    }
  }

  fetchPropsRows() {
    return {
      ref:el=>this.rows = el,
      className:this.css.get("rows")
    }
  }


  render() {
    const { caption, columns, rows, foot } = this.props;

    return (
      <div {...this.fetchPropsSelf()}>
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr {...this.fetchPropsColumns()}/>
          </thead>
        </table>
        <div {...this.fetchPropsRows()}>
          <table>
            <thead>
              <tr>{this.heading(true)}</tr>
            </thead>
            <tbody>
              {rows.map((row, k)=>
                <tr key={k}>{jet.map.it(columns||row, (v, col)=><td key={col}>{row[col]}</td>)}</tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={this.css.get("foot")}>
          {foot}
        </div>
      </div>
    )
  };
}

export default Table;
