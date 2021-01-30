import React from "react";
import gameFunctions from "../../utilities/gameFunctions";

export default class GameOver extends React.Component {
    render() {
        return (
            <div className="gameOver">
                <h1>Game Over!</h1>
                <p>Game Stats:</p>
                <ul>
                    <li>Max Wealth Achieved: {gameFunctions.formatScore(this.props.maxScore)}.</li>
                    <li>Max Income: {gameFunctions.formatScore(this.props.perSecond)} per second.</li>
                    <li>Number of Pints Pulled: {gameFunctions.formatInteger(this.props.defaultItemClicks)}.</li>
                </ul>
                <button onClick={() => gameFunctions.restartGame()}>Restart</button>
            </div>
        );
    }
}
