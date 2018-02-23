import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: '', // tag is empty until the user search for tags
      showFavorites: false // true if the 'show favorites' is active, otherwise false
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Awesome Flickr Gallery</h2>
          <input
            className="app-input"
            onChange={event => this.setState({tag: event.target.value})}
            value={this.state.tag}
            placeholder="Search" // this will give a 'hint' to the user to search for tags
          />
          <FontAwesome 
            className= {(this.state.showFavorites) ? "app-icon-fav-active" : "app-icon"}
            name="heart"
            title="show favorites"
            onClick= {() => this.setState({
              showFavorites: !this.state.showFavorites
            })}
          />
        </div>
        <Gallery tag={this.state.tag} showFavorites={this.state.showFavorites}/>
      </div>
    );
  }
}

export default App;
