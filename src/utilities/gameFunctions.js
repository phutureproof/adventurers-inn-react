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

    /**
     * doBindings
     */
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
     * @returns {number}
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
        return this.numberFormat.format(number/100);
    }

    /**
     * @param score {number|string}
     * @returns {string}
     */
    formatScore(score) {
        return this.scoreFormat.format(score/100);
    }

    /**
     * @param number
     * @returns {string}
     */
    formatInteger(number) {
        return this.integerFormat.format(number/100);
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
                item.items = this.canShowItems(item.items, currentScore);
            }
        });
        return items;
    }

    calculateItemPrices(item) {
        return {
            one: gameFunctions.calculateBuyNItem(item, 1),
            five: gameFunctions.calculateBuyNItem(item, 5),
            ten: gameFunctions.calculateBuyNItem(item, 10),
            hundred: gameFunctions.calculateBuyNItem(item, 100),
        };
    }

    /**
     * calculateBuyNItem
     * @param item {Item}
     * @param amount {number|string}
     * @param currentScore {number}
     */
    calculateBuyNItem(item, amount, currentScore = 0) {
        if (typeof amount === 'number') {
            let quantity = item.quantity;
            let count = item.quantity + amount;
            let modifier = item.costModifier;
            let cost = item.baseCost;
            let price = 0;

            for (let i = 0; i < count; i++) {
                if (i > 0) cost *= modifier;
                if ( (i+1) > quantity) price += cost;
            }

            return price;

        } else if (amount === 'max') {
            let cost = 0;
            let price = 0;
            let iterator = 1;
            while ( (price = this.calculateBuyNItem(item, iterator)) < currentScore) {
                iterator += 1;
                cost = price;
            }
            return ((iterator - 1) === 0) ? {
                cost: price,
                amount: 1
            } : {
                cost: cost,
                amount: (iterator - 1)
            };
        }
    }
}

const gameFunctions = new gameFunctionsClass()

export default gameFunctions;
