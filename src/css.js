import jet from "@randajan/jet-core";

const { cached, virtual } = jet.prop;

const _cnTransitions = ["appear", "appearActive", "appearDone", "enter", "enterActive", "enterDone", "exit", "exitActive", "exitDone"];
const _cache = {};

let _translator = c=>c;

const stringToCN = str=>!str ? undefined : (_cache[str] || (_cache[str] = _translator(str)));
const arrayToCN = arr=>{
    let r = "", ra = "", rs = "";
    for (const c of arr) {
        if ((ra = anyToCN(c)) != null && (rs = String(ra))) { r += " " + rs; }
    }
    return r.trim();
}
const anyToCN = any=>Array.isArray(any) ? arrayToCN(any) : stringToCN(any);

export const cn = (...classNames)=>arrayToCN(classNames);
export const cssTranslate = translator=>{
    if (jet.isRunnable(translator)) { _translator = translator; }
}

cached(cn, {}, "transitions", _=>virtual.all({}, Object.fromEntries(_cnTransitions.map(n=>[n, _=>cn(n)]))));
