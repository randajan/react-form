
import jet from "@randajan/jet-core";
import RunPool from "@randajan/jet-core/runpool";
import { fetchProps } from "../consts";

const { solid, safe, virtual } = jet.prop;

export class PopController {

  constructor(modal, key, props) {
    let state = props = fetchProps(props);

    const createRunPool = key=>new RunPool(
      (...a)=>modal[key].run(...a),
      (...a)=>jet.run(props[key], ...a),
      (...a)=>{ if (props[key] !== state[key]) { jet.run(state[key], ...a);} }
    ).with(this);

    solid.all(this, {
      modal,
      key,
      onChange: createRunPool("onChange"),
      onUp: createRunPool("onUp"),
      onDown: createRunPool("onDown")
    });

    virtual(this, "state", _=>({...state}));
    solid(this, "setState", (newState, ...toListeners)=>{

      const to = {...state, ...fetchProps(newState)}
      const changes = jet.compare(state, to, true);
  
      if (!changes.length) { return changes; }
  
      const { up } = state;
      state = to;
      if (up !== to.up) { to.up ? this.onUp.run(...toListeners) : this.onDown.run(...toListeners); }
        
      this.onChange.run(changes, ...toListeners);
  
      return changes;
    }, false);

  }

  isUp() { return this.state.up; }
  isLock() { return this.state.lock; }
  isTop() { return this.modal.isTop(this); }

  up(state, ...toListeners) { return this.setState({...fetchProps(state), up:true}, ...toListeners); }
  down(...toListeners) { return this.setState({up:false}, ...toListeners); }
  lock(lock, ...toListeners) { return this.setState({lock}, ...toListeners); }
  unlock(lock, ...toListeners) { return this.setState({lock:lock === false}, ...toListeners); }

  blur(source) {
    const { current, modal, state:{ lock, closeOnBlur } } = this;
    if (!source || lock) { return; }
    const cob = closeOnBlur != null ? closeOnBlur : modal?.current?.props?.closeOnBlur;
    if (!cob) { return; }
    const body = current?.body;
    if (!body || body?.contains(source)) { return; }
    this.down();
  }

}