import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import Lightbox from 'react-image-lightbox';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.addImagesWhenScroll = this.addImagesWhenScroll.bind(this);

    this.state = {
      images: [],
      imageIndex: 0,
      shouldExpandImage: false,
      page: 1,
      imagesPerPage: 100
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  updateDimensions() {
    if (document.body.clientWidth != this.state.galleryWidth) {
      this.setState({ galleryWidth: this.getGalleryWidth() });
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&safe_search=1&page=${this.state.page}&per_page=${this.state.imagesPerPage}&extras=owner_name&format=json&nojsoncallback=1`;
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

          // contact image to array, when addImagesWhenScroll aplly, filter out the not found images using indexOf and concat them to the array
          const newPhotos =  res.photos.photo.filter(dto => this.state.images.indexOf(dto) === -1);

          this.setState({
            images: this.state.images.concat(newPhotos)
          });
        }
      }).catch(err => {
        console.error(`Error occurred while trying fetch photos from flicker. err: ${err}`);
      });
  }

  expandImage(dto) {
    this.setState({
      shouldExpandImage: true, // for lightbox to open
      imageIndex: this.state.images.indexOf(dto),
      imageUrlFromDto: this.urlFromDto(dto)
    });
  }

  deleteImage(imgId) {
    const imagesArray = this.state.images;
    imagesArray.map(function (img, index) {
      if (imgId == img.id) {
        return imagesArray.splice(index, 1);
      }
    });
    this.setState({ images: imagesArray });
  }

  //removed from image component and pass it as prop
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  addImagesWhenScroll() {
    let bodyOffsetHeight = document.body.offsetHeight;
    let windowInnerHeight = window.innerHeight;
    let windowPageYOffset = window.pageYOffset;

    if (bodyOffsetHeight <= windowPageYOffset + windowInnerHeight) {
      this.setState({
        page: this.state.page + 1
      });
      this.getImages(this.props.tag);
    }
  }

  fetchNewPhotosBySearch(tag) {
    this.setState({ images: [] });
    this.tryClearLastTimer();

    //200ms avarage human typing time +- .
    let timeOutId = setTimeout(() => (this.getImages(tag)), 200);

    this.setState({ timeOutId });
  }

  tryClearLastTimer() {
    if (this.state.timeOutId) {
      clearTimeout(this.state.timeOutId);
    }
  }

  componentDidMount() {
    this.getImages(this.props.tag);

    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('scroll', this.addImagesWhenScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('scroll', this.addImagesWhenScroll);
  }

  componentWillReceiveProps(props) {
    this.fetchNewPhotosBySearch(props.tag);
  }

  componentDidUpdate(){
    this.updateDimensions();
  }

  render() {
    const { imageIndex, shouldExpandImage, images } = this.state;
    return (
      <div className="gallery-root">

        {shouldExpandImage && (
          <Lightbox
            enableZoom={false}
            imageTitle={images[imageIndex].title}
            mainSrc={this.urlFromDto(images[imageIndex])}
            nextSrc={this.urlFromDto(images[(imageIndex + 1) % images.length])}
            prevSrc={this.urlFromDto(images[(imageIndex + images.length - 1) % images.length])}
            onCloseRequest={() => this.setState({ shouldExpandImage: false })}
            onMovePrevRequest={() =>
              this.setState({
                imageIndex: (imageIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                imageIndex: (imageIndex + 1) % images.length
              })
            }
          />
        )}

        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id}
            dto={dto}
            urlFromDto={this.urlFromDto}
            deleteImage={this.deleteImage.bind(this)}
            expandImage={this.expandImage.bind(this)}
            galleryWidth={this.state.galleryWidth}
          />;
        })}
      </div>
    );
  }
}

export default Gallery;
