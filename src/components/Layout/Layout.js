import React from "react";
import Stats from "../Stats/Stats";
import ItemList from "../ItemList/ItemList";
import Score from "../Score/Score";
import Salary from "../Salary/Salary";
import DefaultItemButton from "../DefaultItemButton/DefaultItemButton";
import './layout.scss';
import gameFunctions from "../../utilities/gameFunctions";

export default class Layout extends React.Component {
    render() {
        const stats = this.props.debug ?
            <Stats
                FPS={this.props.FPS}
                debug={this.props.debug}
                tickLength={this.props.tickLength}
                perSecond={this.props.perSecond}
                perSecondMultiplier={this.props.perSecondMultiplier}
                currentScore={this.props.currentScore}
                maxScore={this.props.maxScore}
                salary={this.props.salary}
                salaryTime={this.props.salaryTime}
                defaultItemClicks={this.props.defaultItemClicks}
                debugClickDefaultItem={this.props.debugClickDefaultItem}
            /> : null;

        return (
            <div className="layout">
                <div className="header">
                    <h1>{this.props.title}</h1>
                </div>
                <div className="stats">
                    {stats}
                </div>

                <div className="scoreContainer">
                    <Score
                        tickLength={this.props.tickLength}
                        currentScore={this.props.currentScore}
                        perSecond={this.props.perSecond}
                        perSecondMultiplier={this.props.perSecondMultiplier}
                    />
                    <Salary
                        salary={this.props.salary}
                        salaryTimer={this.props.salaryTimer}
                    />
                </div>
                <div className="items">
                    <DefaultItemButton
                        defaultItemClickHandler={this.props.defaultItemClickHandler}
                    />
                    <ItemList
                        items={this.props.items}
                        currentScore={this.props.currentScore}
                        parents={[]}
                        purchaseItem={this.props.purchaseItem}
                    />
                </div>
                <div className="footer">
                    <h2>
                        <span style={{float: 'left'}}>
                            <button onClick={() => this.props.saveGame(true)}>Save Game</button>
                            <button onClick={() => {if(window.confirm("Clear data and reload?!")) {this.props.clearSaveData(); gameFunctions.restartGame();}} }>Clear Save &amp; Restart</button>
                        </span>
                        &copy; PhutureProof 2021 Version: {this.props.version}</h2>
                </div>
            </div>
        );
    }
}
