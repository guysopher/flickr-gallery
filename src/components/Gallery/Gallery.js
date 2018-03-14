import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import FontAwesome from 'react-fontawesome';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
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
      isScrollBottom: false,
      page: 1
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
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${this.state.page}&format=json&nojsoncallback=1`;
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
          this.setState({images:this.state.images.concat(res.photos.photo),isScrollBottom:false,page:this.state.page+1});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({galleryWidth: document.body.clientWidth});
    window.addEventListener('resize',  ()=> this.setState({galleryWidth:this.getGalleryWidth()}));
    window.addEventListener('scroll',this.onScrollHandle.bind(this));
  }

  componentWillUnmount(){
    window.removeEventListener('resize', ()=> this.setState({galleryWidth:this.getGalleryWidth()}));
    window.removeEventListener('scroll',this.onScrollHandle.bind(this));
  }

  componentWillReceiveProps(props) {
    if(this.props.tag !== props.tag){
      this.setState({images: []})
    }
    this.getImages(props.tag);
  }

  //Update gallery state after removing an image
  updateNewGallery(newImagesArray){
    this.setState({images: newImagesArray});
  }

  //An event handler for scrolling to the bottom of the document
  onScrollHandle(){
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    let clientHeight = document.documentElement.clientHeight || window.innerHeight;
    let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      if(this.state.isScrollBottom){
        return;
      }
      this.getImages(this.props.tag);
      this.setState({isScrollBottom:true})

    }
  }

  //Sort images array after dropped an image
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      images: arrayMove(this.state.images, oldIndex, newIndex)
    });
  };

  //Render gallery with Drag & Drop feature
  render() {
    const SortableImage = SortableElement(Image);
    const SortableGallery = SortableContainer(() => {
      return (
        <div className="gallery-root">
          {this.state.images.map((dto, index) => (
            <SortableImage key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} images={this.state.images} updateNewGallery={this.updateNewGallery.bind(this)} index={index}  />
          ))}
        </div>
      );
    });

    return (
      <div>
        <SortableGallery axis={'xy'} pressDelay={140} onSortEnd={this.onSortEnd} />
        {this.state.isScrollBottom && (
          <div className="data-loading">
            <FontAwesome className="image-icon" size="4x" name="sync-alt" spin/>
          </div>)}
      </div>
    );
  }
}

export default Gallery;
