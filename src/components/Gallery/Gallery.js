import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import NoResultBox from './NoResultBox.js';
import Lightbox from 'react-image-lightbox';
 
class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isLightBoxOpen: false,
      imageIndex: 0,
      page: 1,
      isLoading: false,
      tag: this.props.tag,
      HasNoResults: false
    };
  }
  
  getNewTagImages(tag) {
    this.getImages(tag).then(newImages => {
      if (null == newImages) {
        this.setState({
          HasNoResults: true
        })
        return;
      }

      this.setState({
        images: newImages,
        page: 1,
        tag: tag,
        HasNoResults: false
      })
    })
  }

  loadMoreImages = () => {
    const MAX_PAGES = 40;
    
    if(MAX_PAGES == this.state.page){
      return;
    }

    this.setState(prevState => ({
        isLoading: true,
        page: prevState.page + 1
      }), () => {
        this.getImages(this.state.tag).then(newImages => this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          isLoading: false
      })));
    });
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
        else {
          return null;
        }
      });
  }

  componentDidMount() {
    this.getNewTagImages(this.props.tag);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(props) {
    this.getNewTagImages(props.tag);
  }

  handleRotate = e => {
    const imgElement = e.target.parentElement.parentElement.firstChild;
    let rotationAngle = (parseInt(imgElement.getAttribute('rotate')) + 90) % 360;

    imgElement.setAttribute('rotate', rotationAngle);
    imgElement.style.transform = `rotate(${rotationAngle}deg)`;
  }

  handleDelete = index => {
    const images = Object.assign([], this.state.images);
    images.splice(index, 1);
    this.setState({images: images})
  }
  
  handleExpand = index => {
    this.setState({
      imageIndex: index,
      isLightBoxOpen: true
    });
  }

  handleScroll = () => {
    if(this.state.isLoading) {
      return;
    }

    const html = document.documentElement;
    const shouldLoadMoreImages = html.scrollHeight - html.scrollTop <= html.clientHeight * 2;

    if (shouldLoadMoreImages) {
        this.loadMoreImages()
    }
  }

  handleDragStart = (index, e) => {
    e.dataTransfer.setData('imageIndex', index);
  }

  handleDragOver = e => {
    e.preventDefault();
  }

  handleDrop = (index, e) => {
    const imageIndex = e.dataTransfer.getData('imageIndex');

    const images = Object.assign([], this.state.images);
    this.swapImages(images, imageIndex, index);

    this.setState({images: images});
  }

  swapImages(images, imageIndex, index) {
    const tempImage = images[imageIndex];
    images[imageIndex] = images[index];
    images[index] = tempImage;
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  getLightBox() {
    const currentIndex = this.state.imageIndex;
    const imagesLength = this.state.images.length;
    const nextIndex = (currentIndex + imagesLength + 1) % imagesLength;
    const prevIndex = (currentIndex + imagesLength - 1) % imagesLength;

    return (<Lightbox
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
    />)
  }

  getGallery() {
    return (
      <div>
        <div>
          {this.state.isLightBoxOpen && this.getLightBox()}
        </div>
        <div className="gallery-root">
        {this.state.images.map((dto, index) => {
          return (<Image
            key={'image-' + this.state.page + '-' + dto.id}
            url={this.urlFromDto(dto)}
            onDelete={this.handleDelete.bind(this, index)}
            onExpand={this.handleExpand.bind(this, index)}
            onRotate={this.handleRotate}
            onDragStart={this.handleDragStart.bind(this, index)}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop.bind(this, index)}
          />);
        })}
      </div>
    </div>);
  }

  render() {
    return (this.state.HasNoResults) ? <NoResultBox/> : this.getGallery();
  }
}

export default Gallery;
