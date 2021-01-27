export default class Item {

    id;
    name;
    baseCost;
    basePerSecondMultiplier = 1.0;
    costModifier;
    quantity;
    perSecond;
    perSecondMultiplier;
    canShow;
    manager;
    items;
    multipliers;

    constructor(
        name = '',
        baseCost = 1.0,
        costModifier = 1.009,
        quantity = 1,
        perSecond = 1,
        perSecondMultiplier = 1.0,
        manager = true,
        multipliers = [],
        items = [],
    ) {
        this.name = name;
        this.baseCost = baseCost;
        this.costModifier = costModifier;
        this.quantity = quantity;
        this.perSecond = perSecond;
        this.perSecondMultiplier = perSecondMultiplier;
        this.basePerSecondMultiplier = perSecondMultiplier;
        this.manager = manager;
        this.multipliers = multipliers;
        this.items = items;
    }
}
