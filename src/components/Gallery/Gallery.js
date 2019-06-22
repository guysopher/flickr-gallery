import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import LargeImage from '../LargeImage';
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
      messagesIndex: 0,
      isShowLargeImage: false,
      largeImage: '',
      largeIndex: 0
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

  handleDelete(dto){
    var messages = ['This image?... interesting...', 'And now this...?', 'Didn\'t see that coming...']
    var num_of_messages = messages.length;
    alert(messages[this.state.messagesIndex]);
     var arr = this.state.images.slice();
     var index = arr.indexOf(dto);
     arr.splice(index, 1);
     this.setState({images: arr,
                    messagesIndex: (Math.floor(Math.random() * (num_of_messages)))})
   }
  
   handleRotate(dto){
    var temp = dto;
    if (temp.rotateAngle) {
      temp.rotateAngle = ((temp.rotateAngle + 90) % 360);
      } else {
        temp.rotateAngle = 90;
      }
    var arr = this.state.images;
    var index = arr.indexOf(dto);
    arr[index] = temp;
    this.setState({images: arr})
   }

  updateIndex(index) {
    this.setState({largeIndex: index})
    this.setState({largeImage: this.state.images[index]});
}
   showLargeImage(dto){
    this.updateIndex(this.state.images.indexOf(dto));
    this.setState({isShowLargeImage: true});
   }

   closeLarge () {
    this.setState({isShowLargeImage: false})
   }

   leftLarge(){
     var tableLen = this.state.images.length;
     var index = this.state.largeIndex - 1
     if (index < 0) {
       index = tableLen - 1;
      }
     this.updateIndex(index);
}
   rightLarge(){
     var tableLen = this.state.images.length;
     var index = this.state.largeIndex + 1
     if (index === tableLen) {
       index = 0;
    }
     this.updateIndex(index);

   }
  render() {
    let display;
    if (this.state.isShowLargeImage){
    // if (this.state.showlarge) {
      display =
      <div>
        <LargeImage dto={this.state.largeImage} 
        closeLarge={() => this.closeLarge()}
        leftLarge={() => this.leftLarge()}
        rightLarge={() => this.rightLarge()}/>
        
        <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
            deleteClick={() => this.handleDelete(dto)} rotateClick={() => this.handleRotate(dto)}
            showLarge={() => this.showLargeImage(dto)}
             />;
        })}
      </div>
      </div>
    } else {
    display =
    <div className="gallery-root">
    {this.state.images.map(dto => {
      return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
        deleteClick={() => this.handleDelete(dto)} rotateClick={() => this.handleRotate(dto)}
        showLarge={() => this.showLargeImage(dto)} />;
    })}
  </div>
    }

    return (
      <div>
    {display}
    </div>
    );
  }
}

export default Gallery;
