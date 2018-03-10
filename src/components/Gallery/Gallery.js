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
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth()
    };

    this.updateGalleryWidth = this.updateGalleryWidth.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.getBoundingClientRect().width;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
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
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateGalleryWidth);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: this.getGalleryWidth()
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateGalleryWidth);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  updateGalleryWidth() {
    this.setState({galleryWidth: this.getGalleryWidth()});
  }

  deleteImage(index) {
    this.setState({images: [...this.state.images.slice(0, index), ...this.state.images.slice(index+1)]});
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, index) => {
          return <Image key={'image-' + dto.id}
                        dto={dto}
                        galleryWidth={this.state.galleryWidth}
                        onDelete={() => this.deleteImage(index)}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
