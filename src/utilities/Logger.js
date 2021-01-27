let instance;

class LoggerClass {
    constructor() {
        if (instance) {
            return instance;
        }
        instance = this;
    }

    /**
     * @param options {object}
     */
    log(options) {
        if (console) {
            console.table(options);
        }
    }
}

let Logger = new LoggerClass();

export default Logger;
