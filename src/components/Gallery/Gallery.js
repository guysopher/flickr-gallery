import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
	this.numOfPhotos = 100;
	this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
	  message:'loading'
    };
	this.handleScroll = this.handleScroll.bind(this);
  }

handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
 console.log('In handle scroll, windowBottom,docHeight: ' + windowBottom.toString() + ',' + docHeight.toString());
    if (windowBottom + 1 >= docHeight) {
	this.numOfPhotos = this.numOfPhotos + 20;
	  console.log('In handleScroll, numOfPhotos: ' + this.numOfPhotos.toString());
	  this.getImages('art',this.numOfPhotos);
    } 
  }
  
 
  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  
  
  getImages(tag) {	 
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.numOfPhotos}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: this.state.images.concat(res.photos.photo)});
        }
      });
  }

  componentDidMount() {
	      window.addEventListener("scroll", this.handleScroll);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });

  }

    componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }
  
  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}/>;
        })}
	    <div className="fixedDiv">{this.state.message}</div>
        <div className="scrollDiv"></div>
		</div>
    );
  }
}

Gallery.propTypes = {
}

Gallery.defaultProps = {
}

export default Gallery;



