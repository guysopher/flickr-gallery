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
      imageIndex: 0,
      page: 1,
      isLoading: false,
      tag: this.props.tag
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getNewTagImages(tag) {
    this.getImages(tag).then(images => this.setState({
      images: images,
      page: 0,
      tag: tag
    }));
  }

  loadMoreImages() {
    this.getImages(this.state.tag).then(images => this.setState(prevState => ({
      images: [...prevState.images, ...images],
      isLoading: false
    })));
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${this.state.page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    return axios({
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
        ) { return res.photos.photo; }
      });
  }

  componentDidMount() {
    this.getNewTagImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(props) {
    this.getNewTagImages(props.tag);
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

  handleScroll() {
    if(this.state.isLoading){
      return;
    }

    const html = document.documentElement;
    const shouldLoadMoreImages = html.scrollHeight - html.scrollTop <= html.clientHeight * 2;

    if (shouldLoadMoreImages) {
      this.setState((prevState) => ({
        isLoading: true,
        page: prevState.page + 1
      }));

      this.loadMoreImages();
    }
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
