import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";
import { each, list } from "@randajan/jet-core/eachSync";

import { Flagable } from "../../components/Flagable";
import { cn } from '../../css';

import "./Table.scss";


export class Table extends Flagable {

  static className = "Table";

  static bindMethods = [
    ...Flagable.bindMethods,
    "refreshSize", "refreshScroll"
  ];

  static customProps = [
    ...Flagable.customProps,
    "rows", "columns", "caption", "foot"
  ];

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

  afterMount() {
    this.cleanUp.add(Element.jet.listen(window, "resize", this.refreshSize));
    this.cleanUp.add(Element.jet.listen(this.rows, "scroll", this.refreshScroll));
  }

  afterRender() {
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
    each(this.headings, th=>th.real.style.width = th.dummy.offsetWidth + "px");
  }

  thRef(el, col, real) {
    const th = this.headings[col] || ( this.headings[col] = {} );
    th[real ? "real":"dummy"] = el;
  }

  heading(real=false) {
    const { columns } = this.props;
    return each(columns, (children, { key })=>{
      const prop = { key, children, ref:el=>this.thRef(el, key, real) };
      return <th {...prop}/>;
    });
  }

  fetchPropsColumns() {
    return {
      ref:el=>this.columns = el,
      className:cn("columns"),
      children:this.heading(true)
    }
  }

  fetchPropsRows() {
    return {
      ref:el=>this.rows = el,
      className:cn("rows")
    }
  }


  render() {
    const { caption, columns, rows, foot } = this.props;

    return (
      <div {...this.fetchProps()}>
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr {...this.fetchPropsColumns()}/>
          </thead>
        </table>
        <div {...this.fetchPropsRows()}>
          <table>
            <thead>
              <tr>{this.heading(false)}</tr>
            </thead>
            <tbody>
              {rows.map((row, k)=>
                <tr key={k}>{list(columns||row, (v, {key})=><td key={key}>{row[key]}</td>)}</tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={cn("foot")}>
          {foot}
        </div>
      </div>
    )
  };
}
