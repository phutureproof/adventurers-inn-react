import React from "react";
import Stats from "../Stats/Stats";
import ItemList from "../ItemList/ItemList";
import {Score} from "../Score/Score";
import {Salary} from "../Salary/Salary";
import './layout.scss';

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
                <div className="left">
                    {stats}
                </div>
                <Score currentScore={this.props.currentScore} />
                <Salary salary={this.props.salary} />
                <div className="items">
                    <button
                        className="defaultItemButton"
                        onClick={() => this.props.defaultItemClickHandler()}
                    >
                        Pull Pint
                    </button>
                    <ItemList
                        items={this.props.items}
                        currentScore={this.props.currentScore}
                        parents={[]}
                        purchaseItem={this.props.purchaseItem}
                    />
                </div>
                <div className="footer"><h2>Version: {this.props.version}</h2></div>
            </div>
        );
    }
}
