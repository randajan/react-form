import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Table.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Table extends Flagable {


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
    this.cleanUp.add(jet.event.hear(window, "resize", this.refreshSize.bind(this)));
    this.cleanUp.add(jet.event.hear(this.rows, "scroll", this.refreshScroll.bind(this)));
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
    jet.obj.map(this.headings, th=>{
      th.real.style.width = jet.web.getBound(th.dummy).width + "px";
    });
  }

  thRef(el, col, dummy) {
    jet.obj.set(this.headings, [col, dummy ? "dummy":"real"], el);
  }

  heading(dummy) {
    const { columns } = this.props;
    return Object.entries(columns).map(([key, children])=>{
      const prop = { key, children, ref:el=>this.thRef(el, key, dummy) };
      return <th {...prop}/>;
    });
  }

  fetchPropsColumns() {
    return {
      ref:el=>this.columns = el,
      className:css.get("columns"),
      children:this.heading(false)
    }
  }

  fetchPropsRows() {
    return {
      ref:el=>this.rows = el,
      className:css.get("rows")
    }
  }


  render() {
    const { caption, columns, rows, foot } = this.props;

    return (
      <div {...this.fetchPropsSelf(css)}>
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
              {jet.arr.wrap(rows).map((row, k)=>
                <tr key={k}>{Object.keys(columns||row).map(col=><td key={col}>{row[col]}</td>)}</tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={css.get("foot")}>
          {foot}
        </div>
      </div>
    )
  };
}

export default Table;
