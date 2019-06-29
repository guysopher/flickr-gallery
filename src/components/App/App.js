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

    if(input === '') {
      this.timeout = setTimeout(() => {
        this.setState({tag: 'art'});
      }, 500);
      return;
    }

    this.timeout = setTimeout(() => {
      this.setState({tag: input});
    }, 500);
  }

  handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const enterKeyCode = 13;
    const input = e.target.value;

    if(keyCode === enterKeyCode) {
      if(input === '') {
        this.setState({tag: 'art'});
        return;
      }

      this.setState({tag: input});
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input"
            placeholder="enter a search word"
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
