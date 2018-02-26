import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Lightbox from '../react-image-lightbox'; // used Lightbox from npmjs, for expand
import FloatingButton from '../Image/FloatingButton';


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
	this.getGalleryWidth = this.getGalleryWidth.bind(this);
    this.state = {
      images: [],
	  cachedImages: [],
      galleryWidth: this.getGalleryWidth(),
	  lightBoxOpen: false,
	  photoIndex: 0, // used for lightbox
	  currentPage: 1 // used to get more images
    };
	this.deleteImage = this.deleteImage.bind(this);
	this.expandImage = this.expandImage.bind(this);
	this.urlFromDto = this.urlFromDto.bind(this);
	this.addOnScroll = this.addOnScroll.bind(this);
	this.handleUndo = this.handleUndo.bind(this);
  }

  getGalleryWidth(){
    try {
	   console.log('gallery width ' + document.body.clientWidth);
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
          this.setState({images: this.state.images.concat(res.photos.photo.filter(dto => !this.state.images.includes(dto))) }); // filter out existing (duplicate) images
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
	window.addEventListener('scroll', this.addOnScroll);
  }
  
  componentWillUnmount() {
	  window.removeEventListener('scroll', this.addOnScroll);
  }

  // if gallery rendered with a new tag, reset everything, else do nothing
  componentWillReceiveProps(props) {
	if (props.newTag) {
	  this.setState({
  	  images: [],
	  cachedImages: [],
	  currentPage: 1,
	  galleryWidth: this.getGalleryWidth()
	  });
      this.getImages(props.tag);
	}
  }

/* receives the image ID to delete from child Image component,
   adds to cachedImages for later reference */
  
  deleteImage(deletedDto) {
      this.setState({
		  images: this.state.images.filter(dto => dto.id !== deletedDto.id),
		  cachedImages: this.state.cachedImages.concat([deletedDto])
	  });
  }
  
  
  expandImage(dto) {
	  this.setState({
		  lightBoxOpen: true,
		  photoIndex: this.state.images.indexOf(dto)
	  });
  }
  
  // tried to export this function...
  // todo export this instead of copy pasting from Image module
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  
  
  // requests 100 more images when user scrolled to bottom
  addOnScroll() {
	  if (document.body.offsetHeight <= window.pageYOffset + window.innerHeight) {
		  this.setState({
			  currentPage: this.state.currentPage + 1
		  });
		  this.getImages(this.props.tag);
	  }
  }
  
  // restores last image deleted (LIFO)
  handleUndo() {
	  const lastImage = this.state.cachedImages[this.state.cachedImages.length - 1];
	  this.setState({
		  images: [lastImage].concat(this.state.images),
		  cachedImages: this.state.cachedImages.filter(dto => dto.id !== lastImage.id)
	  });
  }
  
  render() {
	const _open = this.state.lightBoxOpen;
	const imgs = this.state.images;
	const showUndoBtn = this.state.cachedImages.length !== 0;
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
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} sendToDelete={this.deleteImage} sendToExpand={this.expandImage}/>;
        })}
		{showUndoBtn && (
		<FloatingButton handleClick={this.handleUndo} name="undo-alt" title="undo" />
		)}
      </div>
    );
  }
}

export default Gallery;