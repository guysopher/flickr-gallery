import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  page = 1;
  loading = false;

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageSize: this.calcImageSize()
    };

    this.updateImageSize = this.updateImageSize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.getBoundingClientRect().width;
    } catch (e) {
      return 1000;
    }
  }

  calcImageSize() {
    const galleryWidth = this.getGalleryWidth();
    const targetSize = 200;
    const imagesPerRow = Math.floor(galleryWidth / targetSize);
    return galleryWidth / imagesPerRow;
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${this.page}&per_page=100&format=json&nojsoncallback=1`;
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
          if (this.page ===  1) {
            this.setState({images: res.photos.photo});
          }
          else {
            let i = -1;
            if (this.state.images.length) {
              i = res.photos.photo.findIndex(dto => this.state.images[this.state.images.length - 1].id === dto.id);
            }
            this.setState({images: [...this.state.images, ...res.photos.photo.slice(i + 1)]});
          }
        }
        this.loading = false;
      });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateImageSize);
    window.addEventListener('scroll', this.onScroll);
    this.getImages(this.props.tag);
    this.updateImageSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateImageSize);
    window.removeEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps(props) {
    this.page = 1;
    this.getImages(props.tag);
  }

  updateImageSize() {
    this.setState({imageSize: this.calcImageSize()});
  }

  onScroll() {
    const galleryWidth = this.getGalleryWidth();
    const imagesPerRow = Math.floor(galleryWidth / this.state.imageSize);
    const rows = this.state.images.length / imagesPerRow;
    if (!this.loading && ((rows * this.state.imageSize - window.scrollY) < (3 * this.state.imageSize))) {
      this.loading  = true;
      this.page++;
      this.getImages(this.props.tag);
    }
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
                        size={this.state.imageSize}
                        onDelete={() => this.deleteImage(index)}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
