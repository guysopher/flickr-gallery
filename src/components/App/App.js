import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  constructor() {
    super();
    this.typingTimeout = null;
    this.state = {
      tag: 'art'
    };
  }
  
  handleInput = (e) => {
    clearTimeout(this.typingTimeout);
    const input = e.target.value;
    
    if(input === '') {
      return;
    }
    
    this.typingTimeout = setTimeout(() => {
      this.setState({tag: input});
    }, 500);
  }

  handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const enterKeyCode = 13;
    const input = e.target.value;

    if(keyCode === enterKeyCode) {
      if(input === '') {
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
            type={'text'}
            defaultValue={this.state.tag}
            placeholder={'enter a search word'}
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
