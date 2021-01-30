import React from 'react';
import './advert.scss';

export default class Advert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bonusAmount: 1,
            bonusMultiplier: 1
        };
        this.selectBonusAmount = this.selectBonusAmount.bind(this);
        this.selectBonusMultiplier = this.selectBonusMultiplier.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    selectBonusAmount(e) {
        this.setState({bonusAmount: Number(e.target.value)});
    }

    selectBonusMultiplier(e) {
        let bonusMultiplier = (e.target.value === 'yes');
        this.setState({bonusMultiplier: bonusMultiplier});
    }

    handleSubmit() {
        this.props.adHandler(this.state.bonusAmount, this.state.bonusMultiplier);
    }

    render() {
        return (
            <div className="advert">
                <h2>Advert</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="group">
                        <label>Select Bonus:</label>
                        <select name="bonus" id="bonus" onChange={this.selectBonusAmount}>
                            <option value="1">No Bonus</option>
                            <option value="2">2x</option>
                            <option value="3">3x</option>
                            <option value="4">4x</option>
                            <option value="5">5x</option>
                        </select>
                    </div>
                    <div className="group">
                        <label>Bonus Doubled:</label>
                        <select name="bonus" id="bonus">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="group">
                        <label />
                        <button>
                            Activate Bonus
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
