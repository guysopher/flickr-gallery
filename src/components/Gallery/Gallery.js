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
      isLightBoxOpen: false,
      imageIndex: 0
    };
  }

  getGalleryWidth(){
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
          this.setState({images: res.photos.photo});
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

  handleDelete = (index) => {
    const images = Object.assign([], this.state.images);
    images.splice(index, 1);
    this.setState({images: images})
  }
  
  handleExpand = (index) => {
    this.setState({
      imageIndex: index,
      isLightBoxOpen: true
    });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    const currentIndex = this.state.imageIndex;
    const imagesLength = this.state.images.length;
    const nextIndex = (currentIndex + imagesLength + 1) % imagesLength;
    const prevIndex = (currentIndex + imagesLength - 1) % imagesLength;

    return (
      <div>
        {this.state.isLightBoxOpen && (<Lightbox
          mainSrc={this.urlFromDto(this.state.images[currentIndex])}
          onCloseRequest={() => this.setState({ isLightBoxOpen: false })}
          nextSrc={this.urlFromDto(this.state.images[nextIndex])}
          prevSrc={this.urlFromDto(this.state.images[prevIndex])}
          onMovePrevRequest={() =>
            this.setState({
              imageIndex: prevIndex
            })
          }
          onMoveNextRequest={() =>
            this.setState({
              imageIndex: nextIndex
            })
          }
          enableZoom={false}
        />)}

        <div className="gallery-root">
          {this.state.images.map((dto, index) => {
            return (<Image
              key={'image-' + dto.id}
              url={this.urlFromDto(dto)}
              galleryWidth={this.state.galleryWidth}
              onDelete={this.handleDelete.bind(this, index)}
              onExpand={this.handleExpand.bind(this, index)}
            />);
          })}
        </div>
      </div>
    );
  }
}

export default Gallery;
