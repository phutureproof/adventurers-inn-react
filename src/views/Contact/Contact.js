import React from "react";

export default class Contact extends React.Component {
    render() {
        return (
            <div className="contact">
                <h2>Contact</h2>
                <form>
                    <div className="group">
                        <label htmlFor={"email"}>Email:</label>
                        <input type="text" name="email" id="email"/>
                    </div>
                    <div className="group">
                        <label htmlFor="message">Message:</label>
                        <textarea name="message" id="message" rows="10" />
                    </div>
                    <div className="group">
                        <button type={"button"}>Send Message</button>
                    </div>
                </form>
            </div>
        );
    }
}
