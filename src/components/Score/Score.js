import React from "react";
import gameFunctions from "../../utilities/gameFunctions";
import './score.scss';

export class Score extends React.Component {
    render() {
        return (
            <div className="score">
                <p>{gameFunctions.formatScore(this.props.currentScore)}</p>
            </div>
        );
    }
}
