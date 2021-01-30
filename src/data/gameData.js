import Item from "../classes/Item";
import ItemMultiplier from "../classes/ItemMultiplier"
import gameFunctions from "../utilities/gameFunctions";

/**
 * items
 * @type {Item[]}
 */
const items = [
    new Item('Barstaff', 10000, 1.009, 0, 10, 1.0, true, [
        new ItemMultiplier((item) => (Math.floor(item.quantity/100)), 0.5, 'Multiplied by .5 per 100'),
        new ItemMultiplier((item) => (Math.floor(item.quantity/1000)), 0.5, 'Multiplied by .5 per 1000'),
    ], [
        new Item('Bard', 100000, 1.009, 0, 50, 1.0, true, [
            new ItemMultiplier((item) => (Math.floor(item.quantity/150)), 0.5, 'Multiplied by .5 per 100')
        ], [])
    ]),

    new Item('Miner', 1000000, 1.009, 0, 100, 1.0, true, [
        new ItemMultiplier((item) => (Math.floor(item.quantity/100)), 1.0, 'Multiplied by 2.0 per 100')
    ], [
        new Item('Super Miner', 100000000, 1.009, 0, 1000, 1.0, true, [], [
            new Item('Mega Miner', 10000000000, 1.009, 0, 1000, 1.0, true, [], [])
        ])
    ]),
    new Item('Adventurer', 1000000000000, 1.009, 0, 1000000, 1.0, true, [], []),
    new Item('Orc Warrior', 100000000000000, 1.009, 0, 10000000, 1.0, true, [], [])
];

function addProps(debug = false, items, startingIndex = 0) {

    items.forEach((item) => {
        if(debug) {
            item.baseCost *= 0.01;
        }
        item.id = startingIndex++;
        item.canShow = false;
        item.prices = gameFunctions.calculateItemPrices(item);

        if (item.items) {
            item.items = addProps(debug, item.items, startingIndex);
        }
    });

    return items;
}

export default function gameData(debug = false) {
    return addProps(debug, items);
}
