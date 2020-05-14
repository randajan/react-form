
import jet from "@randajan/jetpack";


class Proper {

    static pass(props, include, exclude) {
        return jet.obj.map({...props, ...include}, (v,k)=>exclude[k] === undefined ? v : undefined);
    }
}



export default Proper;