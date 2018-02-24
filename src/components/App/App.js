import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import {debounce} from 'lodash'


class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
	  renderNewTag: false
    };
	this.handleChange = this.handleChange.bind(this);
	this.shouldRenderNewTag = debounce(this.shouldRenderNewTag, 600);
  }
  
  handleChange(newTag) {
	  
	  this.setState({
		  tag: newTag,
		  renderNewTag: false
		  });
	  
	  this.shouldRenderNewTag();  
  }
  
  shouldRenderNewTag() {
	  
	  this.setState({ renderNewTag: true });
	  
  }
  
  

  render() {
	  const title = 'Flickr Gallery - ' + this.state.tag;
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>{title}</h2>
          <input className="app-input" onChange={(event) => this.handleChange(event.target.value)} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag} newTag={this.state.renderNewTag}/>
      </div>
    );
  }
}

export default App;
