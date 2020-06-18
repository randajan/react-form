
import jet from "@randajan/jetpack";

let DEF = {};

class ClassNames {
    static redefine(defObj) {
        DEF = jet.get("object", defObj);
    }

    static get(css, className) {
        return [DEF[className] || className, css[className]];
    }
    
    static getFactory(css) {
        return {
            get(...classNames) {
                const cns = new jet.Pool("string", true);
                jet.obj.map(classNames, v=>cns.add(ClassNames.get(css, v)), true);
                return jet.obj.join(cns, " ");
            },
            pass(...classNames) {
                return classNames.map(cn=>ClassNames.get(css, cn));
            }
        };
    }

    static fetchFlags(flagsmap, ...args) {
        const flags = new Set();

        jet.obj.map(flagsmap, (flag, key)=>{
            flag = jet.to("string", flag, ...args);
            if (!flag || flag === "false") { return; }
            else if (flag === "true") { flags.add(key); } 
            else { flags.add(flag); }
        }, true);

        return Array.from(flags);
    }
}

export default ClassNames;


