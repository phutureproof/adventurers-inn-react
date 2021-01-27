let instance;

class gameFunctionsClass {
    numberFormat;
    scoreFormat;
    integerFormat;

    /**
     * constructor
     */
    constructor() {

        if (instance) {
            return instance;
        }
        instance = this;

        this.numberFormat = new Intl.NumberFormat(
            'en-GB',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

        this.integerFormat = new Intl.NumberFormat(
            'en-GB',
            {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        );

        this.scoreFormat = new Intl.NumberFormat(
            'en-GB',
            {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )

        this.doBindings();
    }

    doBindings() {
        this.formatNumber = this.formatNumber.bind(this);
        this.formatScore = this.formatScore.bind(this);
        this.formatInteger = this.formatInteger.bind(this);
        this.canShowItems = this.canShowItems.bind(this);
        this.calculateSalary = this.calculateSalary.bind(this);
    }

    /**
     * getItemCostWithMultiplier
     * @param item {Item}
     */
    calculateItemCostWithMultiplier(item) {
        let cost = item.baseCost;
        for (let i = 0; i < item.quantity; i++) {
            cost *= item.costModifier;
        }
        return cost;
    }

    /**
     * @param number {number|string}
     * @returns {number}
     */
    calculateSalary(number) {
        return (Number(number) * 10);
    }

    /**
     * formatNumber
     * @param number {number|string}
     * @returns {string}
     */
    formatNumber(number) {
        return this.numberFormat.format(number);
    }

    /**
     * @param score {number|string}
     * @returns {string}
     */
    formatScore(score) {
        return this.scoreFormat.format(score);
    }

    /**
     * @param number
     * @returns {string}
     */
    formatInteger(number) {
        return this.integerFormat.format(number);
    }

    /**
     * restartGame
     */
    restartGame() {
        let href = document.location;
        document.location = href;
    }

    /**
     *
     * @param items {Item[]}
     */
    calculateItemMultipliers(items) {
        items = items.slice();

        items.forEach((item) => {
            if (item.multipliers.length) {
                item.perSecondMultiplier = item.basePerSecondMultiplier;
                item.multipliers.forEach((multiplier) => {
                    let test = multiplier.expression(item) * multiplier.multiplier;
                    if (test) {
                        item.perSecondMultiplier += test;
                        multiplier.active = true;
                    }
                });
            }
            if (item.items) {
                item.items = this.calculateItemMultipliers(item.items);
            }
        });

        return items;
    }

    /**
     *
     * @param items {Item[]}
     * @returns {number}
     */
    calculatePerSecond(items) {
        let perSecond = 0.0;
        items.forEach((item) => {
            perSecond += ((item.perSecond * item.quantity) * item.perSecondMultiplier);
            if (item.items) {
                perSecond += this.calculatePerSecond(item.items);
            }
        });
        return perSecond;
    }

    /**
     * getRandom
     * @param max
     * @returns {number}
     */
    getRandom(max = 1) {
        return Number((Math.floor(Math.random() * Math.floor(max + 1))));
    }

    /**
     * @param items {Item[]}
     * @param currentScore {number}
     * @returns {Item[]}
     */
    canShowItems(items, currentScore = 0) {
        items = items.slice();
        items.forEach(item => {
            if (!item.canShow) {
                if (currentScore >= (item.baseCost / 100 * 75)) {
                    item.canShow = true;
                }
            }
            if (item.items) {
                item.items = this.canShowItems(item.items);
            }
        });
        return items;
    }
}

const gameFunctions = new gameFunctionsClass()

export default gameFunctions;
