import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Lightbox from 'react-image-lightbox';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
	  lightBoxOpen: false,
	  photoIndex: 0,
	  currentPage: 1
    };
	this.deleteImage = this.deleteImage.bind(this);
	this.expandImage = this.expandImage.bind(this);
	this.updateSize = this.updateSize.bind(this);
	this.urlFromDto = this.urlFromDto.bind(this);
	this.addOnScroll = this.addOnScroll.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  
  getImages(tag) {
	const page = this.state.currentPage;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${page}&per_page=100&format=json&nojsoncallback=1`;
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
          this.setState({images: this.state.images.concat(res.photos.photo.filter(dto => this.state.images.indexOf(dto) === -1))});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
	window.addEventListener('resize', this.updateSize);
	window.addEventListener('scroll', this.addOnScroll);
  }
  
  componentWillUnmount() {
	  window.removeEventListener('resize', this.updateSize);
	  window.removeEventListener('scroll', this.addOnScroll);
  }

  componentWillReceiveProps(props) {
	this.setState({ 
	images: [],
	currentPage: 1
	});
    this.getImages(props.tag);
  }

/* receives the image ID to delete from child Image component */
  
  deleteImage(id) {
      this.setState({
		  images: this.state.images.filter(dto => dto.id !== id)
	  });
  }
  
  
  expandImage(dto) {
	  this.setState({
		  lightBoxOpen: true,
		  photoIndex: this.state.images.indexOf(dto)
	  });
  }
  
  updateSize() {
	  let currentWidth = document.body.clientWidth;
	  this.setState({
		  galleryWidth: currentWidth
	  });
  }
  
  // tried to export this function...
  // todo export this instead of copy pasting from Image module
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  
  addOnScroll() {
	  if (document.body.offsetHeight <= window.pageYOffset + window.innerHeight) {
		  this.setState({
			  currentPage: this.state.currentPage + 1
		  });
			  
		  this.getImages(this.props.tag);
	  }
  }
  
 


  render() {
	  const _open = this.state.lightBoxOpen;
	  const imgs = this.state.images;
    return (
	
	
      <div className="gallery-root" ref={'gallery'}>
	  {_open && (
	    <Lightbox
	        mainSrc={this.urlFromDto(imgs[this.state.photoIndex])}
	        onCloseRequest={() => this.setState({ lightBoxOpen: false })}
			nextSrc={this.urlFromDto(imgs[(this.state.photoIndex + 1) % imgs.length])}
			prevSrc={this.urlFromDto(imgs[(this.state.photoIndex + imgs.length - 1) % imgs.length])}
			onMoveNextRequest={ () => this.setState({ photoIndex: (this.state.photoIndex + 1) % imgs.length })}
			onMovePrevRequest={ () => this.setState({ photoIndex: (this.state.photoIndex + imgs.length - 1) % imgs.length })}
	/>
	)}
        {this.state.images.map(dto => {
          return <Image key={dto.id} dto={dto} galleryWidth={this.state.galleryWidth} sendToDelete={this.deleteImage} sendToExpand={this.expandImage}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
