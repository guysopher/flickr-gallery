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
      galleryHeigh: this.getGalleryHeigh(),
      imageLength:100
    };
  }

  getGalleryWidth(){
    //console.log('clientWidth',document.body.clientWidth);
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getGalleryHeigh(){
    //console.log('clientHeight',document.body.clientHeight);
    try {
      return document.body.clientHeight;
    } catch (e) {
      return 1000;
    }
  }

//${this.state.imageNum}
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.imageLength}&format=json&nojsoncallback=1`;
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
      galleryWidth: document.body.clientWidth,
      galleryHeigh: document.body.clientHeight
    });
  }


  updateImg(){
    var newLength = this.state.imageLength + 100;
    this.componentDidMount();
    this.setState({
      imageLength: newLength
    });
  }




  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root" >
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} galleryHeigh={this.state.galleryHeigh} />;
        })}
        <div>
          <button onClick={()=>{this.updateImg()}} name="updateImg" title="updateImg"> expand more 100 pics</button>
        </div>
      </div>
    );
  }
}

export default Gallery;
