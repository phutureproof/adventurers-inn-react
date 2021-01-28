import React from "react";
import './App.scss';
import Game from "./components/Game/Game";
import { ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {

    showToast(message, type = 'success') {
        let toastOptions = {
            position: 'top-center',
        };
        switch(type) {
            case "success":
                toast.success(message, toastOptions);
                break;
            case "error":
                toast.error(message, toastOptions);
                break;
            default:
                toast(message, toastOptions);
        }
    }

    render() {
        return (
            <div className="App">
                <Game
                    title="Adventurer's Inn"
                    version="0.14.66"
                    showToast={this.showToast.bind(this)}
                />
                <ToastContainer />
            </div>
        );
    }
}
