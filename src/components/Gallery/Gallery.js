import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import ImageView from '../FullImage/ImageView'

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);

    window.addEventListener('scroll', (function() {
      if(window.scrollY + window.innerHeight == document.documentElement.scrollHeight) {
          this.getImages(this.props.tag)
        }
      }).bind(this));
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      selectedItem: null,
      page: 1

    };
  }
  //Scroll Down

//Remove Image
removeImage = (id) =>{
  for(let i = 0; i < this.state.images.length; i++){
    if(this.state.images[i].id === id){
      this.state.images.splice(i, 1);
      this.setState({
        images: this.state.images
      });
      break;
    }
  }
}
// selecting the expended image
  openExpeded = (dto) => {
    this.state.selectedItem = dto;
    this.setState(this.state);
  }

  closeExpanded = () =>{
  //alert('close');
    this.state.selectedItem = null;
    this.setState(this.state);

  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1&page=${this.state.page}`;
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
          this.setState({images: this.state.images.concat(res.photos.photo), page: this.state.page + 1});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image  openImage={this.openExpeded.bind(this)} key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} removeImage={this.removeImage.bind(this)}/>;
        })}
        {
            this.state.selectedItem ?
          <ImageView openImage={this.openExpeded.bind(this)} dto={this.state.selectedItem} images={this.state.images} onClose={this.closeExpanded.bind(this)}></ImageView>: ''
        }

      </div>
    );
  }
}

export default Gallery;
