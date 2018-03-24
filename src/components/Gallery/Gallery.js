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
      images: []
    };
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
    this.getImages(this.props.tag);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  deleteImage = index => {
    const images = this.state.images;
    images.splice(index, 1);
    this.setState({ images: images });
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map( (dto, i) => {
          return <Image index={i} deleteImage={this.deleteImage} key={'image-' + dto.id} dto={dto} />;
        })}
      </div>
    );
  }
}

export default Gallery;
