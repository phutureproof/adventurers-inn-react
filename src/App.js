import React from "react";
import './App.scss';
import Game from "./components/Game/Game";

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Game
                    title="Adventurer's Inn"
                    version="0.14.66"
                />
            </div>
        );
    }
}
