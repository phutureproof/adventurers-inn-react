import React from "react";
import gameFunctions from '../../utilities/gameFunctions';
import Logger from "../../utilities/Logger";
import gameData from "../../data/gameData";
import Layout from "../../views/Layout/Layout";
import GameOver from "../../views/GameOver/GameOver";
import Lore from "../../views/Lore/Lore";
import About from "../../views/About/About";
import Contact from "../../views/Contact/Contact";
import Advert from "../../views/Advert/Advert";
import "./game.scss";

export default class Game extends React.Component {

    /* Frames Per Second */
    FPS = 60;

    /* timers */
    timers = {
        defaults: {
            /* change these (values are time in seconds) */
            salaryTimer: 60,
            bonusTimer: 900,
            saveTimer: 300,
        },
        /* dont change these */
        salaryTimer: 0,
        bonusTimer: 0,
        saveTimer: 0
    };

    /* debug mode */
    debug = true;
    /* gameData debug mode */
    debugGameData = false;
    /* debug click default item (false|integer)*/
    debugClickDefaultItem = false;
    /* globalise game to the window : allows console access to game */
    globalGame = false;

    views = {
        layout: 'layout',
        gameover: 'gameover',
        advert: 'advert',
        lore: 'lore',
        about: 'about',
        contact: 'contact'
    }

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
        currentScore: 0,
        maxScore: 0.0,
        salary: 0.0,
        gameOver: false,
        items: [],
        bonusActive: false,
        bonusDoubled: false,
        bonusMultiplier: 1,
        view: this.views.layout,
        timers: {}
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
        this.adHandler = this.adHandler.bind(this);
        this.changeView = this.changeView.bind(this);
    }

    changeView(view) {
        this.setState({view: view});
    }

    render() {
        let markup;
        switch (this.state.view) {
            case this.views.layout:
            default:
                markup =
                    <Layout
                        title={this.props.title}
                        version={this.props.version}
                        debug={this.debug}
                        FPS={this.FPS}
                        bonusActive={this.state.bonusActive}
                        bonusMultiplier={this.state.bonusMultiplier}
                        bonusDoubled={this.state.bonusDoubled}
                        tickLength={this.tickLength}
                        perSecond={this.state.perSecond}
                        perSecondMultiplier={this.state.perSecondMultiplier}
                        currentScore={this.state.currentScore}
                        maxScore={this.state.maxScore}
                        salary={this.state.salary}
                        salaryTime={this.timers.defaults.salaryTime}
                        salaryTimer={this.timers.salaryTimer}
                        gameOver={this.state.gameOver}
                        items={this.state.items}
                        purchaseItem={this.purchaseItem}
                        defaultItemClickHandler={this.defaultItemClickHandler}
                        defaultItemClicks={this.state.defaultItemClicks}
                        debugClickDefaultItem={this.debugClickDefaultItem}
                        saveGame={this.saveGame}
                        clearSaveData={this.clearSaveData}
                        adHandler={this.adHandler}
                    />
                break;

            case this.views.gameover:
                markup =
                    <GameOver
                        maxScore={this.state.maxScore}
                        perSecond={this.state.perSecond}
                        defaultItemClicks={this.state.defaultItemClicks}
                        items={this.state.items}
                    />
                break;
            case this.views.lore:
                markup =
                    <Lore
                        items={this.state.items}
                    />
                ;
                break;
            case this.views.about:
                markup = <About />;
                break;
            case this.views.contact:
                markup = <Contact />
                break;
            case this.views.advert:
                markup =
                    <Advert
                        adHandler={this.adHandler}
                    />
                break;
        }

        return (
            <div className="game">
                <div className="appTitle">
                    <h1>{this.props.title}</h1>
                </div>
                <div className="navigation">
                    <button onClick={() => this.changeView(this.views.layout)}>Home</button>
                    <button onClick={() => this.changeView(this.views.gameover)}>Game Over</button>
                    <button onClick={() => this.changeView(this.views.lore)}>Lore</button>
                    <button onClick={() => this.changeView(this.views.about)}>About</button>
                    <button onClick={() => this.changeView(this.views.contact)}>Contact</button>
                    <button onClick={() => this.changeView(this.views.advert)}>Advert</button>
                </div>
                <div className="view">
                    {markup}
                </div>
            </div>
        );
    }

    adHandler(multiplier = 1, doubled = false) {
        this.timers.bonusTimer = (multiplier > 1) ? this.timers.defaults.bonusTimer : 0;
        this.setState({
            view: this.views.layout,
            bonusActive: (multiplier > 1),
            bonusDoubled: doubled,
            bonusMultiplier: multiplier,
        }, () => {
            this.saveGame(false);
        });
    }

    clearSaveData() {
        let storage = window.localStorage;
        storage.removeItem('gameData');
        if (this.debug) {
            Logger.log({
                message: 'Clearing saved game data'
            });
        }
    }

    saveGame(showToast = false) {
        let storage = window.localStorage;
        let saveData = {...this.state};
        saveData.timers = {...this.timers};
        saveData.timestamp = Date.now();
        storage.setItem('gameData', JSON.stringify(saveData));
        if (showToast) {
            this.props.showToast('Game saved', 'info');
        }
        if (this.debug) {
            Logger.log({
                message: 'Saving game state',
                saveData: saveData
            });
        }

    }

    loadGame(showToast = false) {
        let storage = window.localStorage;
        let state = JSON.parse(storage.getItem('gameData'));
        if (!state) {
            return;
        }
        this.timers = {...state.timers};
        delete state.timers;

        let defaultItems = gameData(this.debugGameData);
        this.mapItemMultipliers(defaultItems, state.items);
        state.items = gameFunctions.calculateItemMultipliers(state.items);

        let date = Date.now();
        let diff = Math.floor((date - state.timestamp) / 1000);
        let toAdd = (state.perSecond * state.perSecondMultiplier) * diff;

        if (toAdd > 0) {
            state.currentScore += toAdd;
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

        if (showToast && toAdd > 0) {
            let score = <span className="score">{gameFunctions.formatScore(toAdd)}</span>
            let toastMessage = <p>Your staff earned {score} while you were away!</p>;
            this.props.showToast(toastMessage, 'success');
        }

    }

    mapItemMultipliers(defaultItems, stateItems) {
        Array.from(defaultItems).forEach(dItem => {
            stateItems.forEach(sItem => {
                if (dItem.id === sItem.id) {
                    sItem.multipliers = dItem.multipliers;
                }
                if (sItem.items) {
                    this.mapItemMultipliers(defaultItems, sItem.items);
                }
            });
        });
    }


    gameTimers() {
        // salary timer
        if (this.state.salary > 0) {
            if (this.timers.salaryTimer === 0) {
                this.takeSalary();
                this.timers.salaryTimer = this.timers.defaults.salaryTimer;
            } else {
                this.timers.salaryTimer--;
            }
            if (this.debug) {
                Logger.log({
                    message: 'salary timer',
                    value: this.timers.salaryTimer
                });
            }
        }

        // bonus timer
        if (this.state.bonusActive) {

            if (this.debug) {
                Logger.log({
                    message: 'bonus timer',
                    value: this.timers.bonusTimer
                });
            }

            if (this.timers.bonusTimer === 0) {
                this.setState({
                    bonusActive: false,
                    bonusDoubled: false,
                    bonusMultiplier: 1
                });
                this.timers.bonusTimer = this.timers.defaults.bonusTimer;
            } else {
                this.timers.bonusTimer--;
            }
        }

        // auto save timer
        if (this.debug) {
            Logger.log({
                message: 'save timer',
                value: this.timers.saveTimer
            });
        }

        if (this.timers.saveTimer === 0) {
            this.saveGame();
            this.timers.saveTimer = this.timers.defaults.saveTimer;
        } else {
            this.timers.saveTimer--;
        }

        this.setState({
            timers: {...this.timers}
        });
    }

    perTickCalculations() {
        let newScore = (this.state.perSecond * this.state.perSecondMultiplier);
        if (this.state.bonusActive) {
            newScore *= this.state.bonusMultiplier;
            newScore *= ((this.state.bonusDoubled) ? 2 : 1);
        }
        newScore += this.state.currentScore;

        let newMaxScore = newScore > this.state.maxScore ? newScore : this.state.maxScore;
        let items = gameFunctions.canShowItems(this.state.items, this.state.currentScore);


        this.setState({
            currentScore: newScore,
            maxScore: newMaxScore,
            items: items,
            salary: gameFunctions.calculateSalary(this.state.perSecond)
        });
    }

    tick() {
        this.gameTimers();
        this.perTickCalculations();
    }

    defaultItemClickHandler() {
        let amount = 100;

        if (this.debugClickDefaultItem) {
            amount = this.debugClickDefaultItem;
        }

        amount *= this.state.bonusMultiplier;
        if (this.state.bonusActive) {
            let bonusMultiplier = (this.state.bonusDoubled) ? 2 : 1;
            amount *= bonusMultiplier;
        }

        let newScore = (this.state.currentScore + amount);
        let clicks = (this.state.defaultItemClicks + amount);

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
            1000
        );
    }

    stopTicking() {
        clearInterval(this.timer);
        this.timer = null;
    }

    componentDidMount() {
        //window.addEventListener("focus", this.onFocus);
        //window.addEventListener("blur", this.onBlur);
        let storage = window.localStorage;
        if (storage.getItem('gameData')) {
            this.loadGame(true);
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
        //window.removeEventListener("focus", this.onFocus);
        //window.removeEventListener("blur", this.onBlur);
        this.stopTicking();
    }

    onFocus() {
        if (this.debug) {
            Logger.log("Gained Focus");
        }
        this.loadGame(true);
    }

    onBlur() {
        if (this.debug) {
            Logger.log("Lost Focus");
        }
        this.saveGame();
        this.stopTicking();
    }

    takeSalary() {
        let newScore = (this.state.currentScore - this.state.salary);
        if (newScore < 0) {
            this.stopTicking();
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
