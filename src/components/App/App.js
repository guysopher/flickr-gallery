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
      tag: '', // tag is empty until the user searches for tags
      showFavorites: false, // true if the 'show favorites' is active, otherwise false
      resetGallery: false // true when 'reset' button is the last action made, otherwise false
    };
  }

  turnOffReset() {
    this.setState({
      resetGallery: false
    });
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
            className= {(this.state.showFavorites) ? 'app-icon-fav-active' : 'app-icon'}
            name="heart" title="show favorites"
            /*This button filters the gallery so that only the favorited images will be presented.
              Note: when showing favorited images, navigation arrows on expand mode are not displayed. */
            onClick= {() => this.setState({showFavorites: !this.state.showFavorites})}
          />
          <FontAwesome
            className="app-icon" name="redo-alt" title="reset tag search"
            /*This button disables the 'show favorites' button and resets the gallery,
              meaning that any deletion or rotation action is unmade.
              Important: images not from the first page (100 first images) will have to be reloaded. */
            onClick= {() => {this.setState({
                showFavorites: false,
                resetGallery: true
            })}}
          />
        </div>
        <Gallery
          tag={this.state.tag}
          showFavorites={this.state.showFavorites}
          resetGallery={this.state.resetGallery}
          turnOffReset= {() => this.turnOffReset()}
        />
      </div>
    );
  }
}

export default App;
