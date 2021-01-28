import React from "react";
import Layout from "../Layout/Layout";
import gameFunctions from '../../utilities/gameFunctions';
import Logger from "../../utilities/Logger";
import gameData from "../../data/gameData";
import './game.scss';

let Cookie = require('js-cookie');

export default class Game extends React.Component {

    /* Frames Per Second */
    FPS = 30;
    /* Time in seconds to remove salary */
    salaryTime = 60;
    /* Time in seconds to save game state to cookie */
    saveTime = 30;
    /* debug mode */
    debug = false;
    /* gameData debug mode */
    debugGameData = false;
    /* debug click default item (false|integer)*/
    debugClickDefaultItem = false;
    /* globalise game to the window : allows console access to game */
    globalGame = false;

    /* Auto calculated */
    tickLength;
    timer;
    salaryTimer;
    saveTimer;
    currentScore;
    numberFormat;

    initialState = {
        defaultItemClicks: 0,
        perSecond: 0.0,
        perSecondMultiplier: 1.0,
        currentScore: 100.0,
        maxScore: 0.0,
        salary: 0.0,
        gameOver: false,
        items: []
    };

    constructor(props) {
        super(props);
        this.tickLength = 1000 / this.FPS;
        this.state = this.initialState;
        this.doBindings();
        if (this.globalGame) {
            window.game = this;
        }
    }

    doBindings() {
        this.defaultItemClickHandler = this.defaultItemClickHandler.bind(this);
        this.purchaseItem = this.purchaseItem.bind(this);
        this.saveGame = this.saveGame.bind(this);
        this.loadGame = this.loadGame.bind(this);
        this.clearSaveData = this.clearSaveData.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    render() {
        const markup = !this.state.gameOver ?
            <Layout
                title={this.props.title}
                version={this.props.version}
                debug={this.debug}
                FPS={this.FPS}
                tickLength={this.tickLength}
                perSecond={this.state.perSecond}
                perSecondMultiplier={this.state.perSecondMultiplier}
                currentScore={this.state.currentScore}
                maxScore={this.state.maxScore}
                salary={this.state.salary}
                salaryTime={this.salaryTime}
                gameOver={this.state.gameOver}
                items={this.state.items}
                purchaseItem={this.purchaseItem}
                defaultItemClickHandler={this.defaultItemClickHandler}
                defaultItemClicks={this.state.defaultItemClicks}
                debugClickDefaultItem={this.debugClickDefaultItem}
            />
            :
            <div className="gameOver">
                <h1>Game Over!</h1>
                <p>Game Stats:</p>
                <ul>
                    <li>Max Wealth Achieved: {gameFunctions.formatScore(this.state.maxScore)}.</li>
                    <li>Max Income: {gameFunctions.formatScore(this.state.perSecond)} per second.</li>
                    <li>Number of Pints Pulled: {gameFunctions.formatInteger(this.state.defaultItemClicks)}.</li>
                </ul>
                <button onClick={() => gameFunctions.restartGame()}>Restart</button>
            </div>

        return (
            <div className="game">
                {markup}

                <button onClick={() => this.saveGame()}>Save Game</button>
                <button onClick={() => this.loadGame()}>Load Game</button>
                <button onClick={() => {
                    this.clearSaveData();
                    gameFunctions.restartGame();
                }}>Clear Game Save Data
                </button>
            </div>
        );
    }

    saveGame() {
        let saveData = {...this.state};
        saveData.timestamp = Date.now();
        Cookie.set('gameState', saveData, {expires: 365});
        if (this.debug) {
            Logger.log({
                message: 'Saving game state',
                saveData: saveData
            });
        }
    }

    loadGame() {
        let state = Cookie.getJSON('gameState');
        if (!state) {
            return;
        }
        let defaultItems = gameData(this.debugGameData);
        this.mapItemMultipliers(defaultItems, state.items);
        state.items = gameFunctions.calculateItemMultipliers(state.items);
        let date = Date.now();
        let diff = Math.floor((date - state.timestamp) / 1000);
        let toAdd = (state.perSecond * state.perSecondMultiplier) * diff;

        if (toAdd > 0) {
            state.currentScore += toAdd;
            alert(`Your staff earned ${gameFunctions.formatScore(toAdd)} while you were away!`);
        }

        this.setState(
            state,
            () => {
                if (!this.timer) {
                    this.startTicking()
                }
            }
        );

        if (this.debug) {
            Logger.log(state);
        }

        return toAdd;
    }

    mapItemMultipliers(defaultItems, stateItems) {
        Array.from(defaultItems).forEach(dItem => {
            stateItems.forEach(sItem => {
                if (dItem.id === sItem.id) {
                    sItem.multipliers = dItem.multipliers;
                    sItem.name = dItem.name;
                }
                if (sItem.items) {
                    this.mapItemMultipliers(defaultItems, sItem.items);
                }
            });
            if (dItem.items) {
                this.mapItemMultipliers(dItem, stateItems);
            }
        });
    }

    clearSaveData() {
        Cookie.remove("gameState");
        if (this.debug) {
            Logger.log({
                message: 'Clearing saved game data'
            });
        }
    }

    addGameData() {
        this.setState({
            items: gameData(this.debugGameData)
        });
    }

    tick() {
        if (!this.salaryTimer && this.state.salary > 0) {
            this.startSalaryTimer();
        }

        let newScore = Number(this.state.currentScore + ((this.state.perSecond * this.state.perSecondMultiplier) * this.tickLength) / 1000);
        let newMaxScore = newScore > this.state.maxScore ? newScore : this.state.maxScore;
        let items = gameFunctions.canShowItems(this.state.items, this.state.currentScore);

        this.setState({
            currentScore: newScore,
            maxScore: newMaxScore,
            items: items,
            salary: gameFunctions.calculateSalary(this.state.perSecond)
        });
    }

    defaultItemClickHandler() {
        let multiplier = 1;

        if (this.debugClickDefaultItem) {
            multiplier = this.debugClickDefaultItem;
        }

        let newScore = (this.state.currentScore + multiplier);
        let clicks = (this.state.defaultItemClicks + multiplier);

        this.setState({
            currentScore: newScore,
            defaultItemClicks: clicks
        });
        if (this.debug) {
            Logger.log({
                message: 'Purchasing default item',
                clicks: clicks
            });
        }
    }

    startTicking() {
        this.timer = setInterval(
            () => this.tick(),
            this.tickLength
        );
        this.saveTimer = setInterval(
            () => this.saveGame(),
            (this.saveTime * 1000)
        );
    }

    stopTicking() {
        clearInterval(this.timer);
        clearInterval(this.saveTimer);
        this.timer = null;
        this.saveTimer = null;
    }

    startSalaryTimer() {
        let time = (this.salaryTime * 1000);
        this.salaryTimer = setInterval(
            () => this.takeSalary(),
            time
        )
    }

    stopSalaryTimer() {
        clearInterval(this.salaryTimer);
        this.salaryTime = null;
    }

    componentDidMount() {
        window.addEventListener("focus", this.onFocus);
        window.addEventListener("blur", this.onBlur);
        if (Cookie.getJSON("gameState")) {
            this.loadGame();
        } else {
            this.setState({
                items: gameData(this.debugGameData)
            }, () => {
                this.setState({
                    perSecond: gameFunctions.calculatePerSecond(this.state.items)
                }, () => {
                    this.startTicking();
                });
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("focus", this.onFocus);
        window.removeEventListener("blur", this.onBlur);
        this.stopTicking();
        this.stopSalaryTimer();
    }

    onFocus() {
        if (this.debug) {
            Logger.log("Gained Focus");
        }
        this.loadGame();
    }

    onBlur() {
        if (this.debug) {
            Logger.log("Lost Focus");
        }
        this.saveGame();
    }

    takeSalary() {
        let newScore = (this.state.currentScore - this.state.salary);
        if (newScore < 0) {
            this.stopTicking();
            this.stopSalaryTimer();
            this.clearSaveData();
            this.setState({
                gameOver: true
            });
        }
        this.setState({
            currentScore: newScore
        });
        if (this.debug) {
            Logger.log({
                message: 'Taking salary',
                amount: gameFunctions.formatNumber(this.state.salary)
            })
        }
    }

    purchaseItem(itemIds, quantity = 1, cost = 0) {
        /** @type {Item} **/
        let foundItem;
        let items = this.state.items.slice();

        itemIds.forEach(id => {
            foundItem = foundItem ? foundItem.items[id] : items[id];
        });

        if (!foundItem) {
            if (this.debug) {
                Logger.log({
                    message: "Could not find item for purchase!",
                    itemIds: itemIds,
                    quantity: quantity
                });
            }
        } else {
            foundItem.quantity += quantity;
            foundItem.prices = gameFunctions.calculateItemPrices(foundItem);
            items = gameFunctions.calculateItemMultipliers(items);

            if (this.debug) {
                Logger.log({
                    message: `Purchasing ${foundItem.name}`,
                    price: cost
                });
            }

            this.setState({
                items: items,
                currentScore: (this.state.currentScore - cost)
            }, () => {
                this.setState({
                    perSecond: gameFunctions.calculatePerSecond(this.state.items),
                });
            });
        }
    }
}
