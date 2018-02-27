import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import InfiniteScroll from 'react-infinite-scroller';
import View from '../Image/View';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.openView = this.openView.bind(this);
    this.calcNumberOfImages = this.calcNumberOfImages.bind(this);
    this.state = {
      images: [],
      pinImages: [],
      numOfImages: this.calcNumberOfImages(),
      openView: false,
      indexForView: 1,
      galleryWidth: this.getGalleryWidth()
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  calcNumberOfImages(){
    try {
      const ImageSize = this.calcImageSize();
      const height = document.body.clientHeight;
      const imagesPerRow = Math.round(this.getGalleryWidth() / 300);
      const numberOfRows = Math.round(ImageSize/height);
      return numberOfRows*imagesPerRow;
    } catch (e) {
      return 100;
    }
  }

  calcImageSize() {
    const galleryWidth = this.getGalleryWidth();
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    return galleryWidth/imagesPerRow;
  }

  loadMore(pageToLoad){
    const ImagesPerRow = Math.round(this.getGalleryWidth() / 200);
    const extraImages = Math.round(pageToLoad * ImagesPerRow * 7);
    const newNumOfImages = Math.max(this.state.numOfImages + extraImages,20);
    this.getImages(this.props.tag, newNumOfImages);
  }

  removeImage(indexToDelete,isPinBool){
    if(isPinBool){
      const newImages = this.state.pinImages.filter((image,index) =>
        index!==indexToDelete);
      this.setState({
        pinImages: newImages
      });
    }else {
      const newImages = this.state.images.filter((image, index) =>
        index !== indexToDelete);
      this.setState({
        images: newImages
      });
    }
  }

  addToPinImages(IndexToAdd){
    let newImage = this.state.images.filter((image,index) =>
      index===IndexToAdd);
    this.setState({
      pinImages: this.state.pinImages.concat(newImage)
    });
    this.removeImage(IndexToAdd,false);
  }

  openView(index){
    this.setState({
      openView: true,
      indexForView: index
    });
  }

  getImages(tag, numOfImages) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${numOfImages}&format=json&nojsoncallback=1`;
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
          this.setState({
            images: res.photos.photo
          });
        }
      });
  }

  componentWillUnmount(){
    window.removeEventListener('resize',() => {this.setState({galleryWidth: this.getGalleryWidth()})});
  }

  componentDidMount() {
    window.addEventListener('resize',() => {this.setState({galleryWidth: this.getGalleryWidth()})});
    this.getImages(this.props.tag,this.state.numOfImages);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag,this.state.numOfImages);
  }

  render() {
    const allImages = this.state.pinImages.concat(this.state.images);
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadMore.bind(this)}
        hasMore={true}
        initialLoad={false}
        threshold={250}
      >
        <div className="gallery-root">
          {this.state.pinImages.map((dto,index) => {
            return <Image key={'image-' + dto.id} dto={dto}
                          openView={() => this.openView(index)}
                          removeImage={() => this.removeImage(index,true)}
                          imageSize={this.calcImageSize()}
                          pinImage={() => alert('already pin')}
                          pin={true}/>;
          })}

          {this.state.images.map((dto,index) => {
            return <Image key={'image-' + dto.id} dto={dto}
                          openView={() => this.openView(this.state.pinImages.length + index)}
                          removeImage={() => this.removeImage(index,false)}
                          imageSize={this.calcImageSize()}
                          pinImage={() => this.addToPinImages(index)}
                          pin={false}/>;
          })}
        </div>
        <View shouldOpenView={this.state.openView}
              imagesForView={allImages.map(dto => {return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`})}
              index={this.state.indexForView}
              closeView={()=>this.setState({ openView: false})}/>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
