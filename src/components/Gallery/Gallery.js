import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import BigImage from '../BigImage';
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
        selectedImageIndex:0,
        showExpend:false
    };

    this.deleteImage = this.deleteImage.bind(this);
    this.endOfScroll = this.endOfScroll.bind(this);
    this.selectImageExpend = this.selectImageExpend.bind(this);
    this.closeExpend = this.closeExpend.bind(this);
    this.openExpend = this.openExpend.bind(this);
    this.page = 1;

  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
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
          this.setState({images: [...this.state.images,...res.photos.photo]});
        }
      });
  }

  deleteImage(imageId){
    this.setState({
      images: this.state.images.filter((image) => image.id !== imageId)
    })
  }

  componentDidMount() {
      let that = this;
      this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
      window.addEventListener('resize', ()=> {
          that.setState({
              galleryWidth: that.getGalleryWidth()
          });
      })
      window.addEventListener('scroll', this.endOfScroll);
  }

    endOfScroll() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                this.page++;
                this.getImages()
            }
    }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  selectImageExpend(index) {
      if(index !== -1 && index !== this.state.images.length) {
          this.setState({
              selectedImageIndex:index
          })
      }
  }

  closeExpend() {
    this.setState({
      showExpend:false
    })
  }

  openExpend(index) {
      this.setState({
          showExpend:true,
          selectedImageIndex:index
      })
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto,index) => {
          return <Image key={'image-' + dto.id} delete={this.deleteImage} dto={dto} galleryWidth={this.state.galleryWidth} openExpend={this.openExpend} imageIndex={index}/>;
        })}
          { this.state.showExpend &&
          <BigImage delete={this.deleteImage} images={this.state.images} selectedImageIndex={this.state.selectedImageIndex} selectImageExpend={this.selectImageExpend} closeExpend={this.closeExpend} />
          }
      </div>
    );
  }
}

export default Gallery;
