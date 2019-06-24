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
      largeIndex: 0,
      page: 0
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    let page = this.state.page + 1;
        
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${page}&per_page=100&format=json&nojsoncallback=1`;
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
          let gallery = this.state.images;
          gallery = [...gallery, ...res.photos.photo]
          this.setState({images: gallery, page: page});
        }
      });
    }
  
  // ============ resize handling ===============
  updateDimensions () {
    this.setState({galleryWidth: document.body.clientWidth})
  }
  componentDidMount() {
    this.getImages(this.props.tag);
    window.addEventListener('resize', this.updateDimensions.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));

  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }
  
  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  //========buttons handlers==============
  //delete button
  handleDelete(dto) {
    var arr = this.state.images.slice();
    var index = arr.indexOf(dto);
    arr.splice(index, 1);
    
    
    var messages = ['This image?... interesting...', 'And now this...?', 'Didn\'t see that coming...']
    var indexMessage = this.state.messagesIndex + 1;
    
    if (indexMessage == messages.length) {
      indexMessage = 0;
    }
    
    this.setState({images: arr, messagesIndex:indexMessage})
    alert(messages[this.state.messagesIndex]);
  }
  
  //rotate button
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
  
  //enlarge button
  showLargeImage(dto){
    this.updateLargeImageIndex(this.state.images.indexOf(dto));
    this.setState({isShowLargeImage: true});
  }
  
  updateLargeImageIndex(index) {
    this.setState({largeIndex: index})
    this.setState({largeImage: this.state.images[index]});
  }

  // buttons on large image handlers
   handleCloseLarge () {
    this.setState({isShowLargeImage: false})
   }

   handleLeftClick(){
     var tableLen = this.state.images.length;
     var index = this.state.largeIndex - 1
     if (index < 0) {
       index = tableLen - 1;
      }
     this.updateLargeImageIndex(index);
}
   handleRightClick(){
     var tableLen = this.state.images.length;
     var index = this.state.largeIndex + 1
     if (index === tableLen) {
       index = 0;
    }
     this.updateLargeImageIndex(index);

   }

   handleScroll() {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
       this.getImages(this.props.tag);
        document.removeEventListener('scroll', this.trackScrolling);
   }
  }
  render() {
    let showLarge =
    <div>
    <LargeImage dto={this.state.largeImage}
    handleCloseLarge={() => this.handleCloseLarge()}
    handleLeftClick={() => this.handleLeftClick()}
    handleRightClick={() => this.handleRightClick()}/>
    </div>
    
    let showGallery =
    <div> {this.state.numberOfImages}

    <div className="gallery-root">
    {this.state.images.map(dto => {
      return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
        deleteClick={() => this.handleDelete(dto)} rotateClick={() => this.handleRotate(dto)}
        showLarge={() => this.showLargeImage(dto)}
      />;
      })}
    </div>
    </div>

    let display;

    if (this.state.isShowLargeImage){
      display = <div>{showLarge} {showGallery}</div>
    } else {
      display = <div> {showGallery} </div>
    }

    return (
      <div id="app-root-scroll">
    {display}
    </div>
    );
  }
}

export default Gallery;