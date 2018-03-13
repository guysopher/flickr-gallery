/****************************************************************************/
/*                                                                          */
/* This file contains the photo App Component(search)                       */
/*                                                                          */
/*                                                                          */
/****************************************************************************/
import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
/*
 * App Component
 * tag- the current tag the user has requested photo of
 */
class App extends React.Component {
  static propTypes = {
  };
  /*
   * Constructor
   */
  constructor() {
    super();
    this.state = {
      tag: ''
    };
  }
  /*
   * render - In our case the render function updating the tag according to the user input
   */
  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" placeholder={'search flickr for an amazing images'} onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
