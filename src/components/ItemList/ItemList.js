import React from "react";
import './itemlist.scss';
import gameFunctions from "../../utilities/gameFunctions";

export default class ItemList extends React.Component {

    pluralise(word, amount) {
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
            return (
                <li key={item.id} className={item.canShow ? '' : 'hidden'}>
                    <div className="itemContainer">
                        <p>{item.quantity} {this.pluralise(item.name, item.quantity)} generating {gameFunctions.formatNumber((item.quantity * item.perSecond) * item.perSecondMultiplier)} per second</p>

                        <button
                            disabled={(this.props.currentScore < gameFunctions.calculateItemCostWithMultiplier(item))}
                            onClick={() => this.props.purchaseItem(itemIds, 1)}
                        >
                            Buy {item.name} for {gameFunctions.formatNumber(gameFunctions.calculateItemCostWithMultiplier(item))}
                        </button>

                        {this.multipliers(item)}

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
