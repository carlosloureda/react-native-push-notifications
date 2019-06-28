import React from "react";
import "./App.css";
import { MESSAGE_ENPOINT } from "lou-rnpt-common";

export default class App extends React.Component {
  state = {
    notification: {
      title: "",
      body: "",
      data: {
        screen: "UserSettings",
        userId: "123"
      }
    }
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
      body: JSON.stringify({ message: this.state.notification })
    }).catch(e => console.warn("error fetching: ", e));
  };
  render() {
    const { notification } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Send a notification to the mobile device:</h1>
          <form>
            <div className="rowForm">
              <label>Title:</label>
              <input
                type="text"
                value={notification.title}
                onChange={e =>
                  this.setState({
                    notification: {
                      ...notification,
                      title: e.target.value
                    }
                  })
                }
                className="textInput"
              />
            </div>
            <div className="rowForm">
              <label>Message:</label>
              <input
                type="text"
                value={notification.body}
                onChange={e =>
                  this.setState({
                    notification: {
                      ...notification,
                      body: e.target.value
                    }
                  })
                }
                className="textInput"
              />
            </div>

            <button className="buttonForm" onClick={e => this.sendMessage(e)}>
              Send
            </button>
          </form>
        </header>
      </div>
    );
  }
}
