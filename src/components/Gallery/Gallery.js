import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Modal from '../Modal';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isModalOpen : false,
      modalIndex : 0,
      requestSent: false,
      page: 1,
      imgesToModal: []
    };
    this.resize = this.resize.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.buildPrevArr = this.buildPrevArr.bind(this);
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth - 15; // 15 is padding
    } catch (e) {
      return 1000;
    }
  }


  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1&page=${this.state.page}`;
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
            var lastIndex = this.state.images.findIndex(Image => Image.id === res.photos.photo[0].id);
            var newArr = this.state.images.slice(0,lastIndex);
            this.setState({images: newArr.concat(res.photos.photo),
                          requestSent: false});
        }
      });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.handleOnScroll);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
     });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  //event listener when the window is resize
  resize(){
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }


  //onscroll event handler.
  //when scrolled to buttom this function requent new photos from flicker api
  handleOnScroll(){
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if(scrolledToBottom){
      if(this.state.requestSent){
        return;
      }
      this.setState({page: this.state.page + 1 });
      this.getImages(this.props.tag);
      this.setState({requestSent:true});
    }
  }


  //------------------- Delete image event handler ---------------------------------
  //delete images by gallery. event is trigered in image by trash button and gallery
  // deleteImage function is the event handler for this case.
  deleteImage(imageid){
    
    //find image
    var img_to_remove = this.state.images.find(Image => Image.id === imageid);
    this.setState({images: this.state.images.filter(function(image) {
        return img_to_remove !== image
    })});
  }

  //open modal when extend button is pressed
  openModal(imageId){
    this.toggleModal();
    var indexOfImage = this.state.images.findIndex(Image => Image.id === imageId);
    this.setState ({modalIndex :indexOfImage,
      imgesToModal : this.buildPrevArr(indexOfImage)});
  }
  
  // toggle modal state open\close
  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  // handle changes in modal. (modal request for next photo)
  nextImage(indexPrefix){
    var index = this.state.modalIndex + indexPrefix;
    this.setState({modalIndex : index,
      imgesToModal : this.buildPrevArr(index) });

  }

  // preview array for modal
  buildPrevArr(index){
    var arrLen = this.state.images.length;
    var upperBound = ((((index+3)%arrLen)+arrLen)%arrLen);
    var lowerBound = ((((index-2)%arrLen)+arrLen)%arrLen);

    var tempArr =[];

    if(upperBound < lowerBound){
      tempArr = (this.state.images.slice(lowerBound,arrLen));
      tempArr = tempArr.concat(this.state.images.slice(0,upperBound));
    }
    else{
      tempArr = this.state.images.slice(lowerBound,upperBound);
    }
    return tempArr;
  }

  render() {
    return (
      <div>
        <div className="gallery-root" id ="gallery" >
          {this.state.images.map(dto => {
            return <Image deleteImage = {this.deleteImage} openModal = {this.openModal}
            key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} />;
          })}
        </div>

        <div>
          <Modal show = {this.state.isModalOpen} onClose = {this.toggleModal}
           imageToShow = {this.state.imgesToModal} nextImage = {this.nextImage} index >
          </Modal>
        </div>
      </div>
    );
  }
}

export default Gallery;
