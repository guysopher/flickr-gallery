import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Logo from '../Logo';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'Golden ratio'
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <Logo/>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
