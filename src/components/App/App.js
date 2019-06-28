import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.timeout = null;
    this.state = {
      tag: 'art'
    };
  }

  handleInput = (e) => {
    const input = e.target.value;
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({tag: input});
    }, 500);
  }

  handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const enterKeyCode = 13;

    if(keyCode === enterKeyCode) {
      this.setState({tag: e.target.value});
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input"
            onChange={this.handleInput}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
