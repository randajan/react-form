
import jet from "@randajan/jetpack";

class Checker {
    static list = new jet.RunPool();
    static interval = 100;
}

//initialize run
(function check() { Checker.list.run(); setTimeout(check, Checker.interval);})();


export default Checker;