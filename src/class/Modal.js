
import jet from "@randajan/jet-react";

import { Pool, RunPool } from '@randajan/jet-core';
import { Pop } from "./Pop";

const { solid } = jet.prop;

export class Modal {

    constructor() {

        solid.all(this, {
            onChange: new RunPool().with(this),
            onUp: new RunPool().with(this),
            onDown: new RunPool().with(this),
            pops: solid.all({}, {
                all: new Pool().autoFilter(v=>v instanceof Pop),
                up: new Pool().autoFilter(v=>v instanceof Pop)
            })
        });

        this.onUp.add((_, pop) => this.pops.up.add(pop));
        this.onDown.add((_, pop) => this.pops.up.remove(pop));

    }

    addPop(props) {
        const { all } = this.pops;
        const pop = new Pop(this, all.length, props);
        all.add(pop);
        return pop;
    }

    getTop() { return this.pops.up[this.pops.up.length - 1]; }
    isTop(pop) { return this.getTop() === pop; }
    isUp(pop) { return pop ? this.pops.up.has(pop) : !!this.pops.up.length; }

}