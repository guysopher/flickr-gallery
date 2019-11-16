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
      galleryWidth: this.getGalleryWidth(),
    };

    this.getImages = this.getImages.bind(this);
    window.onscroll = ()=> {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1000)) {
        this.getImages(props.tag);
      }
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
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
          let newArr = this.state.images.concat(res.photos.photo);
          this.setState({images: newArr});
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
      <div id="sortable" className="gallery-root">
        <div
          className="lightBox"
          style={{
      display:'none'
          }}>
        </div>
        {this.state.images.map((dto, index) => {
          return <Image key={'image-' + index} dto={dto} index={index} galleryWidth={this.state.galleryWidth}/>;
        })}
      </div>
  );
  }
}

export default Gallery;
