import React from "react";
import jet from "@randajan/jetpack";

class Proper {

    static pass(props, include, exclude) {
        props = {...props, ...include};
        return exclude ? jet.obj.map(props, (v,k)=>exclude[k] === undefined ? v : undefined) : props;
    }
    static inject(children, injection, filter, deep) {
        if (!jet.is("object", children, true)) { return children; }
        if (filter) { filter = jet.get("array", filter, [filter]); }
        const level = jet.get("number", deep);
        
        return React.Children.toArray(children).map((ele, key)=>{
            if (!React.isValidElement(ele)) { return ele; }
            const include = (!filter || filter.includes(ele.type));
            const inject = jet.get("object", include ? jet.is("function", injection) ? injection(ele, key, level) : injection : null);
            const children = deep ? Proper.inject(ele.props.children, injection, filter, level+1) : null;
            if (children) { inject.children = children; }
            return jet.isFull(inject) ? React.cloneElement(ele, inject) : ele;
        });
    }
}



export default Proper;