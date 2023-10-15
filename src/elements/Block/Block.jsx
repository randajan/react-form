import React, { useContext } from 'react';


import jet from "@randajan/jet-core";

import { Flagable } from '../../components/Flagable';
import { Caption } from '../Caption/Caption';

const context = React.createContext();

export class Block extends Flagable {

  static use() { return useContext(context) || 0; }

  static className = "Block";
  
  static customProps = [
      ...Flagable.customProps,
      "children", "caption", "level"
  ];

  static defaultProps = {
    ...Flagable.defaultProps,
    level:1
  }

  fetchChildren() {
    const { caption } = this.props;

    return (
      <>
        { caption ? <Caption>{caption}</Caption> : null }
        { this.props.children }
      </>
    )
  }

  render() {
    const { level } = this.props;

    return (
      <context.Consumer>
        {lvl=>(
          <context.Provider value={lvl == null ? 0 : lvl+level}>
            <div {...this.fetchProps()}>
              { this.fetchChildren() }
            </div>
          </context.Provider>
        )}
      </context.Consumer>
    )
  }
}
