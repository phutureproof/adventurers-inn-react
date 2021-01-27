import React from "react";
import "./stats.scss";
import gameFunctions from "../../utilities/gameFunctions";

export default class Stats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showStats: false
        };
    }

    toggleStatsDisplay() {
        this.setState({
            showStats: !this.state.showStats
        });
    }

    render() {
        const debug = !this.props.debug ? '' : <li className="debugMessage">DEBUG MODE IS ON</li>;
        const clickDebug = !this.props.debugClickDefaultItem ?
            ''
            :
            <li className="debugMessage">DEBUG DEFAULT ITEM CLICK IS ON (EACH CLICK: {gameFunctions.formatInteger(this.props.debugClickDefaultItem)})</li>
        ;
        const stats = this.state.showStats ?
            <ul>
                {debug}
                {clickDebug}
                <li>FPS: {this.props.FPS}</li>
                <li>Tick Duration (ms): {gameFunctions.formatNumber(this.props.tickLength)}</li>
                <li>Per Tick: {gameFunctions.formatNumber((this.props.perSecond * this.props.perSecondMultiplier) / 1000 * this.props.FPS)}</li>
                <li>Per Second: {gameFunctions.formatNumber(this.props.perSecond * this.props.perSecondMultiplier)}</li>
                <li>Per 10 Seconds: {gameFunctions.formatNumber(this.props.perSecond * this.props.perSecondMultiplier * 10)}</li>
                <li>Salary Time: {this.props.salaryTime}</li>
                <li>Max Wealth: {gameFunctions.formatScore(this.props.maxScore)}</li>
                <li>Current Wealth: {gameFunctions.formatScore(this.props.currentScore)}</li>
                <li>Salary: {gameFunctions.formatScore(this.props.salary)}</li>
                <li>Default Items Bought: {gameFunctions.formatInteger(this.props.defaultItemClicks)}</li>
            </ul> : '';
        return (
            <div className="stats">
                <p className="toggleDisplay" onClick={() => this.toggleStatsDisplay()}>Stats</p>
                {stats}
            </div>
        );
    }
}
