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
            let max = gameFunctions.calculateBuyNItem(item, 'max', this.props.currentScore);
            return (
                <li key={item.id} className={item.canShow ? '' : 'hidden'}>
                    <div className="itemContainer">
                        <p>{item.quantity} {this.pluralise(item.name, item.quantity)} generating {gameFunctions.formatNumber((item.quantity * item.perSecond) * item.perSecondMultiplier)} per second</p>
                        <div className="buyButtons">
                            <button
                                disabled={(this.props.currentScore < item.prices.one)}
                                onClick={() => this.props.purchaseItem(itemIds, 1, item.prices.one)}
                            >
                                Hire 1 for {gameFunctions.formatScore(item.prices.one)}
                            </button>

                            <button
                                disabled={(this.props.currentScore < item.prices.five)}
                                onClick={() => this.props.purchaseItem(itemIds, 5, item.prices.five)}
                            >
                                Hire 5 for {gameFunctions.formatScore(item.prices.five)}
                            </button>
                            <button
                                disabled={(this.props.currentScore < item.prices.ten)}
                                onClick={() => this.props.purchaseItem(itemIds, 10, item.prices.ten)}
                            >
                                Hire 10 for {gameFunctions.formatScore(item.prices.ten)}
                            </button>
                            <button
                                disabled={(this.props.currentScore < item.prices.hundred)}
                                onClick={() => this.props.purchaseItem(itemIds, 100, item.prices.hundred)}
                            >
                                Hire 100 for {gameFunctions.formatScore(item.prices.hundred)}
                            </button>
                            <button
                                disabled={(this.props.currentScore < max.cost)}
                                onClick={() => this.props.purchaseItem(itemIds, max.amount, max.cost)}
                            >
                                Hire {max.amount} for {gameFunctions.formatScore(max.cost)}
                            </button>
                        </div>


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
