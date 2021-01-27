export default class ItemMultiplier {
    expression;
    multiplier = 1.0;
    label = '';
    active = false;

    constructor(expression, multiplier = 1.0, label = '', active = false) {
        this.expression = expression;
        this.multiplier = multiplier;
        this.label = label;
        this.active = active;
    }
}
