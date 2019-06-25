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
      isShowLargeImage: 'none',
      largeImage: '',
      largeIndex: 0,
      page: 0,
      draggedIndex: 0
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.myfunction = this.myfunction.bind(this);
    this.moveImage = this.moveImage.bind(this);
    
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
  
    componentDidMount() {
      this.getImages(this.props.tag);
      this.setState({gallerWidth: document.body.clientWidth});
      window.addEventListener('resize', this.updateDimensions.bind(this));
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    componentWillReceiveProps(props) {
      this.getImages(props.tag);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions.bind(this));
    }

    // ============ resize handling ===============
  updateDimensions () {
    this.setState({galleryWidth: document.body.clientWidth})
  }
  
  //========buttons on normal picture handlers==============
  //delete button
  handleDelete(dto) {
    let arr = this.state.images.slice();
    let index = arr.indexOf(dto);
    arr.splice(index, 1);
    
    
    let messages = ['This image?... interesting...', 'And now this...?', 'Ok... That\'s enough...']
    if (this.state.messagesIndex < messages.length) {
      alert(messages[this.state.messagesIndex]);
      let messagesIndex = this.state.messagesIndex + 1;
      this.setState({messagesIndex: messagesIndex});
    }
    
    this.setState({images: arr});
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
    this.updateLargeImage(this.state.images.indexOf(dto));
    this.setState({isShowLargeImage: 'block'});
  }
  
  updateLargeImage(index) {
    this.setState({largeIndex: index})
    this.setState({largeImage: this.state.images[index]});
  }

  // ============buttons on large image handlers============
  // close button (X)
  handleCloseLarge () {
    this.setState({isShowLargeImage: 'none'})
   }
   // left button (<)
   handleLeftClick(){
     var index = this.state.largeIndex - 1
    
     //  go to end if reached beginning
    if (index < 0) {
       index = this.state.images.length - 1;
      }
     this.updateLargeImage(index);
}
  // right button (>)
   handleRightClick(){
     var index = this.state.largeIndex + 1
     
     // go to beginning if reached the end
     if (index === this.state.images.length) {
       index = 0;
    }
     this.updateLargeImage(index);
   }
// ========== handle scroll =========
   handleScroll() {
     // check it reached (almost) end of screen - and if so - get more images
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200){
        this.getImages(this.props.tag);
        
        // remove the event listener
        document.removeEventListener('scroll', this.trackScrolling);
   }
  }



  moveImage(draggedId, droppedId) {
    // get the dragged image and it's index
    let draggedImage = this.state.images.find(dto => dto.id === draggedId);
    let draggedIndex = this.state.images.indexOf(draggedImage);
    
    // get the dropped image's index
    let droppedIndex = this.state.images.findIndex(dto => dto.id === droppedId);
    
    // copy the original
    let arr = this.state.images.slice();

    // remove the dragged and insert it again in the dropped index
    arr.splice(draggedIndex, 1);
    arr.splice(droppedIndex, 0, draggedImage);
    
    this.setState({images: arr})
   }
    myfunction (num1){
     alert(num1);
   }

  render() {

    return (
      <div>
    <LargeImage dto={this.state.largeImage}
    handleCloseLarge={() => this.handleCloseLarge()}
    handleLeftClick={() => this.handleLeftClick()}
    handleRightClick={() => this.handleRightClick()}
    isShowLargeImage={this.state.isShowLargeImage}
    />

    <div className="gallery-root">
    {this.state.images.map(dto => {
      return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}
        deleteClick={() => this.handleDelete(dto)} rotateClick={() => this.handleRotate(dto)}
        showLarge={() => this.showLargeImage(dto)}
        setDraggedIndex={() => this.setDraggedIndex(dto)}
        handleDrop={() => this.handleDrop(dto)}
        myfunction={this.myfunction}
        moveImage={this.moveImage}
      />;
      })}
    </div>
    </div>

    );
  }
}

export default Gallery;