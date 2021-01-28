import React from "react";
import gameFunctions from "../../utilities/gameFunctions";
import './salary.scss';

export default class Salary extends React.Component {
    render() {
        let fontSize = Math.max(20, 50 - this.props.salaryTimer);
        return (
            <div className="salary">
                <p style={{fontSize: fontSize + 'px'}}>{gameFunctions.formatScore(this.props.salary)}</p>
            </div>
        );
    }
}
