import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art'
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Welcome Guy Sopher</h2>
          <h2>Flickr Gallery - Version By Asaf Halbani Batan</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag} width={document.body.clientWidth}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;