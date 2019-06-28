import React from "react";
import "./App.css";
const MESSAGE_ENPOINT = "http://9a6d8012.ngrok.io/message";

export default class App extends React.Component {
  state = {
    message: ""
  };

  sendMessage = e => {
    e.preventDefault();
    fetch(MESSAGE_ENPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: false
      },
      body: JSON.stringify({ message: this.state.message })
    }).catch(e => console.warn("error fetching: ", e));
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Send a notification to the mobile device:</h1>
          <form>
            <input
              type="text"
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
            />

            <button onClick={e => this.sendMessage(e)}>Send</button>
          </form>
        </header>
      </div>
    );
  }
}
