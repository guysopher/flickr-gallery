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
      page: 0

    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    // set a page to Get. in each iteration - function will call the next page
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
          // save the gallery so far recieved
          let gallery = this.state.images;

          // append to it the new images
          gallery = [...gallery, ...res.photos.photo]
          
          this.setState({images: gallery, page: page});
        }
      });
    }
  
    componentDidMount() {
      this.getImages(this.props.tag);
      // set event listers for resize and scroll
      window.addEventListener('resize', this.handleResize.bind(this));
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    componentWillReceiveProps(props) {
      this.getImages(props.tag);
    }

  //================= resize handling  ===============================
  handleResize () {
    this.setState({galleryWidth: this.getGalleryWidth()})
  }
  
  //============ buttons on normal picture handlers ==================
  
  //======== delete button=======
  handleDelete(dto) {
    let gallery = this.state.images.slice();
    let index = gallery.indexOf(dto);
    gallery.splice(index, 1);
    
  // (show messages when click delete - this part is just for fun)
    let messages = ['This image?... interesting...', 'And now this...?', 'Ok... That\'s enough...']
    if (this.state.messagesIndex < messages.length) {
      alert(messages[this.state.messagesIndex]);
      let messagesIndex = this.state.messagesIndex + 1;
      this.setState({messagesIndex: messagesIndex});
    }
    
    this.setState({images: gallery});
  }
  
  //======= rotate button ======
  handleRotate(dto){
    var rotatedImage = dto;
    // if already rotated - update the angle
    if (rotatedImage.rotateAngle) {
      rotatedImage.rotateAngle = ((rotatedImage.rotateAngle + 90) % 360);
    // otherwise - add a rotate angle property to the image
    } else {
      rotatedImage.rotateAngle = 90;
    }
    
    // update the image
    var gallery = this.state.images;
    var index = gallery.indexOf(dto);
    gallery[index] = rotatedImage;
    this.setState({images: gallery})
  }
  
  //========== enlarge button========
  showLargeImage(dto){
    // update the large image and make it visible
    this.updateLargeImage(this.state.images.indexOf(dto));
    this.setState({isShowLargeImage: 'block'});
  }
  
  updateLargeImage(index) {
    //update largeimage and it's index
    this.setState({largeIndex: index})
    this.setState({largeImage: this.state.images[index]});
  }

  // ================ buttons on large image ==================
  
  // ===== close (X)=======
  handleCloseLarge () {
    this.setState({isShowLargeImage: 'none'})
   }
  
  // ======= left button (<) ==========
  handleLeftClick(){
     var index = this.state.largeIndex - 1
    
     //  go to end if reached beginning
    if (index < 0) {
       index = this.state.images.length - 1;
      }
     this.updateLargeImage(index);
  }
  
  // ====== right button (>)=========
  handleRightClick(){
     var index = this.state.largeIndex + 1
     
     // go to beginning if reached the end
     if (index === this.state.images.length) {
       index = 0;
    }
     this.updateLargeImage(index);
   }

  // =============== handle scroll ==============
   handleScroll() {
     // check it reached (almost) end of screen - and if so - get more images
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500){
        this.getImages(this.props.tag);
        
        // remove the event listener
        document.removeEventListener('scroll', this.trackScrolling);
   }
  }
  // ========= handle drag image ==============
  handleDrag(draggedId, droppedId) {
    // get the dragged image and it's index from child component
    let draggedImage = this.state.images.find(dto => dto.id === draggedId)
    
    // get the dropped image's index
    let droppedIndex = this.state.images.findIndex(dto => dto.id === droppedId);
    
    // copy the original gallery
    let gallery = this.state.images.slice();

    // remove the dragged and insert it again in the dropped inde
    gallery.splice(draggedId, 1);
    // gallery.splice(droppedIndex, 0, draggedImage);
    
    // update the new gallery
    this.setState({images: gallery})
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

      <div className="gallery-root" name="gallery">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto}
                        galleryWidth={this.state.galleryWidth}
                        handleDelete={() => this.handleDelete(dto)}
                        handleRotate={() => this.handleRotate(dto)}
                        handleEnlarge={() => this.showLargeImage(dto)}
                        handleDrag={this.handleDrag}
                  />;
        })}
      </div>
    </div>
    );
  }
}

export default Gallery;