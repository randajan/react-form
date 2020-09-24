import React, { Component } from 'react';

import jet from "@randajan/react-jetpack";

import cssfile from "./Table.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Table extends Component {

  ths = {};

  componentDidMount() {
    this.cleanUp = [
      jet.event.hear(window, "resize", this.refreshSize.bind(this)),
      jet.event.hear(this.rows, "scroll", this.refreshScroll.bind(this)),
    ];
    this.refreshSize();
  }

  componentDidUpdate() {
    this.refreshSize();
  }

  componentWillUnmount() {
    jet.run(this.cleanup);
  }

  refreshScroll() {
    const { columns, rows } = this;
    if (!columns || !rows) { return; }
    columns.scrollLeft = rows.scrollLeft;
    columns.style.width = rows.clientWidth + "px";
  }

  refreshSize() {
    this.refreshScroll();
    jet.obj.map(this.ths, th=>{
      th.real.style.width = jet.web.getBound(th.dummy).width + "px";
    });
  }

  thRef(el, col, dummy) {
    jet.obj.set(this.ths, [col, dummy ? "dummy":"real"], el);
  }

  heading(dummy) {
    const { columns } = this.props;
    return Object.entries(columns).map(([key, children])=>{
      const prop = { key, children, ref:el=>this.thRef(el, key, dummy) };
      return <th {...prop}/>;
    });
  }

  render() {
    const { className, caption, columns, rows, foot } = this.props;

    return (
      <div className={css.get("Table", className)}>
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr className={css.get("columns")} ref={el=>this.columns = el}>
            {this.heading(false)}
            </tr>
          </thead>
        </table>
        <div className={css.get("rows")} ref={el=>this.rows = el}>
          <table>
            <thead ref={el=>this.dummies = el}>
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
