import React from 'react';
import './App.scss';
import Gallery from '../Gallery';


class App extends React.Component {
  static propTypes = {
   
  };

  constructor() {
    super();
    this.fullScreenImage = this.fullScreenImage.bind(this);
    this.closeSlider = this.closeSlider.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.prevImage = this.prevImage.bind(this);
  
    this.state = {
      tag: 'art',
      frontImage: null
    };
  }

  
  closeSlider() {
    var temp = document.getElementById('ImageSlider');
    temp.style.display = 'none';

  }

  fullScreenImage(image_com_to_show) {
    
    var Imcmp = document.getElementById(image_com_to_show);
    var img = document.getElementById('imshow');
    var slider = document.getElementById('ImageSlider');


    var lenUrl = Imcmp.style.backgroundImage.length - 2;
    img.src = Imcmp.style.backgroundImage.substring(5, lenUrl);

    slider.style.display = 'block';
    this.state.frontImage = Imcmp;
  }


  nextImage() {


    var front = document.getElementById('imshow');
    var slider = document.getElementById('ImageSlider');

    var nextImage = this.state.frontImage.nextElementSibling;
    var lenUrl = nextImage.style.backgroundImage.length - 2;

    front.src = nextImage.style.backgroundImage.substring(5, lenUrl);
    this.state.frontImage = nextImage;


  }

  prevImage() {

    var front = document.getElementById('imshow');
    var slider = document.getElementById('ImageSlider');


    var prevImage = this.state.frontImage.previousElementSibling;
    var lenUrl = prevImage.style.backgroundImage.length - 2;

    front.src = prevImage.style.backgroundImage.substring(5, lenUrl);
    this.state.frontImage = prevImage;






  }




  render() {
    return (
     
      
        <div className="app-root">
          <div className="slider" id="ImageSlider">
            <a className="close-btn" onClick={this.closeSlider}>&times;</a>
            <a className="prev" onClick={this.prevImage} >&#10094;</a>
            <a className="next" onClick={this.nextImage} >&#10095;</a>
            <img className="frot-image" id="imshow" /></div>
          <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({ tag: event.target.value })} value={this.state.tag} />
          <Gallery Myfunc={this.fullScreenImage} tag={this.state.tag} />
        </div>
      </div>
     
    );
  }
  
}

export default App;
