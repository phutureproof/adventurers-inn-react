import React from "react";
import './itemlist.scss';
import gameFunctions from "../../utilities/gameFunctions";

export default class ItemList extends React.Component {

    pluralise(word, amount) {
        if(word === 'Barstaff') {
            return word;
        }
        return (amount === 0 || amount > 1) ? word + 's' : word;
    }

    multipliers(item) {
        if(!item.multipliers) {
            return;
        }
        return item.multipliers.map((multiplier, index) => {
            if(multiplier.active) {
                return(
                    <p key={index}>{multiplier.label}</p>
                );
            }
            return '';
        });
    }

    render() {

        const markup = this.props.items.map((item) => {
            const itemIds = this.props.parents.slice().concat(item.id);
            let buyfive = gameFunctions.calculateBuyNItem(item, 5);
            let buyten = gameFunctions.calculateBuyNItem(item, 10);
            let buyhundred = gameFunctions.calculateBuyNItem(item, 100);
            let max = gameFunctions.calculateBuyNItem(item, 'max', this.props.currentScore);
            return (
                <li key={item.id} className={item.canShow ? '' : 'hidden'}>
                    <div className="itemContainer">
                        <p>{item.quantity} {this.pluralise(item.name, item.quantity)} generating {gameFunctions.formatNumber((item.quantity * item.perSecond) * item.perSecondMultiplier)} per second</p>

                        <button
                            disabled={(this.props.currentScore < gameFunctions.calculateItemCostWithMultiplier(item))}
                            onClick={() => this.props.purchaseItem(itemIds, 1)}
                        >
                            Hire {item.name} for {gameFunctions.formatScore(gameFunctions.calculateItemCostWithMultiplier(item))}
                        </button>

                        <button disabled={(this.props.currentScore < buyfive)} onClick={() => this.props.purchaseItem(itemIds, 5, buyfive)}>Hire 5 for {gameFunctions.formatScore(buyfive)}</button>
                        <button disabled={(this.props.currentScore < buyten)} onClick={() => this.props.purchaseItem(itemIds, 10, buyten)}>Hire 10 for {gameFunctions.formatScore(buyten)}</button>
                        <button disabled={(this.props.currentScore < buyhundred)} onClick={() => this.props.purchaseItem(itemIds, 100, buyhundred)}>Hire 100 for {gameFunctions.formatScore(buyhundred)}</button>
                        <button disabled={(max.amount < 1)} onClick={() => this.props.purchaseItem(itemIds, max.amount, max.cost)}>Hire {max.amount} for {gameFunctions.formatScore(max.cost)}</button>

                        <div className="multipliers">
                            {this.multipliers(item)}
                        </div>

                        <ItemList
                            items={item.items}
                            currentScore={this.props.currentScore}
                            parents={itemIds}
                            purchaseItem={this.props.purchaseItem}
                            formatNumber={this.props.formatNumber}
                        />
                    </div>
                </li>
            );
        });

        return (
            <div className="itemlist">
                <ul>
                    {markup}
                </ul>
            </div>
        );
    }
}
