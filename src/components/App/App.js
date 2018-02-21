import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: ''
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input 
            className="app-input"
            onChange={event => this.setState({tag: event.target.value})}
            value={this.state.tag}
            placeholder="Search" // this will give a 'hint' to the user to search for tags
          />
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
