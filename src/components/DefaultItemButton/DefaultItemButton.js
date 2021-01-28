import React from "react";
import './defaultItemButton.scss';

export default class DefaultItemButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        }
    }

    handleClick() {
        if (!this.state.disabled) {
            this.props.defaultItemClickHandler()
        }
        this.setState({disabled: true}, () => {
            setTimeout(
                () => {this.setState({disabled: false})},
                100
            );
        })
    }

    render() {
        return (
            <div className="defaultItemButton">
                <button onClick={() => this.handleClick()}>Pull Pint</button>
            </div>
        );
    }
}
