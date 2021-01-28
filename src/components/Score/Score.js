import React from "react";
import gameFunctions from "../../utilities/gameFunctions";
import './score.scss';

export default class Score extends React.Component {
    timer;

    constructor(props) {
        super(props);
        this.state = {
            score: this.props.currentScore
        }
    }

    render() {
        return (
            <div className="score">
                <p>{gameFunctions.formatScore(this.state.score)}</p>
            </div>
        );
    }

    tick() {

        let testScore = (this.props.currentScore - this.state.score);
        if (Math.abs(testScore) < 0.01) {
            this.setState({score: this.props.currentScore});
            return;
        }

        if (this.state.score !== this.props.currentScore) {
            let newScore = (
                (testScore)
                * this.props.tickLength / 50
            );
            this.setState({
                score: this.state.score + newScore
            });
        }
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.tick(),
            this.props.tickLength
        )
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }
}
