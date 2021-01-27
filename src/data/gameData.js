import Item from "../classes/Item";
import ItemMultiplier from "../classes/ItemMultiplier"
/**
 * items
 * @type {Item[]}
 */
const items = [
    new Item('Barstaff', 100, 1.009, 0, 0.1, 1.0, true, [
        new ItemMultiplier((item) => (Math.floor(item.quantity/100)), 0.5, 'Multiplied by .5 per 100')
    ], []),
    new Item('Miner', 10000, 1.009, 0, 10, 1.0, true, [
        new ItemMultiplier((item) => (Math.floor(item.quantity/100)), 1.0, 'Multiplied by 2.0 per 100')
    ], [
        new Item('Super Miner', 1000000, 1.009, 0, 100, 1.0, true, [], [
            new Item('Mega Miner', 100000000, 1.009, 0, 1000, 1.0, true, [], [])
        ])
    ]),
    new Item('Adventurer', 10000000000, 1.009, 0, 10000, 1.0, true, [])
];

function addProps(debug = false, items, startingIndex = 0) {

    items.forEach((item) => {
        if(debug) {
            item.baseCost *= 0.01;
        }
        item.id = startingIndex++;
        item.canShow = false;

        if (item.items) {
            item.items = addProps(debug, item.items);
        }
    });

    return items;
}

export default function gameData(debug = false) {
    return addProps(debug, items);
}
