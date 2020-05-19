import React from "react";
import jet from "@randajan/jetpack";

class Proper {

    static pass(props, include, exclude) {
        props = {...props, ...include};
        return exclude ? jet.obj.map(props, (v,k)=>exclude[k] === undefined ? v : undefined) : props;
    }
    static inject(children, injection, filter, deep) {
        const level = jet.get("number", deep);
        if (filter) { filter = jet.get("array", filter, [filter]); }
        return React.Children.toArray(children).map((ele, key)=>{
            const include = (!filter || filter.includes(ele.type));
            const inject = jet.get("object", include ? jet.is("function", injection) ? injection(ele, key, level) : injection : null);
            if (ele && deep && jet.is("object", ele.props.children, true)) {
                inject.children = Proper.inject(ele.props.children, injection, filter, level+1);
            }
            return jet.isFull(inject) ? React.cloneElement(ele, inject) : ele;
        });
    }
}



export default Proper;