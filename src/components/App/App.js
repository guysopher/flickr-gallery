import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Modal from '../Modal';
class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      isOpen: false,
      url: ''
    };
  }
  toggleModal = () => {
    this.setState({
        isOpen: !this.state.isOpen
     });
    }
  onChildChanged(url) {
    this.toggleModal();
    this.setState({
      url: url
    });
  }
  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery callbackParent={url => this.onChildChanged(url)} tag={this.state.tag}/>
        <Modal show={this.state.isOpen}
          onClose={this.toggleModal}
          img = {this.state.url}
          >
        </Modal>
      </div>
    );
  }
}

export default App;
