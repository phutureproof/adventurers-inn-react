import React from "react";
import gameFunctions from "../../utilities/gameFunctions";
import './salary.scss';

export default class Salary extends React.Component {
    render() {
        return (
            <div className="salary">
                <p>{gameFunctions.formatScore(this.props.salary)}</p>
            </div>
        );
    }
}
