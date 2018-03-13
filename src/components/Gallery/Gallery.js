import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import FontAwesome from 'react-fontawesome';
import './Gallery.scss';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      loadImages: false,
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
          this.setState({images:this.state.images.concat(res.photos.photo),loadImages:false,page:this.state.page+1});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({galleryWidth: document.body.clientWidth});
    window.addEventListener('resize',  ()=> this.setState({galleryWidth:this.getGalleryWidth()}));
    window.addEventListener('scroll',this.scrollHandler.bind(this));
  }

  componentWillUnmount(){
    window.removeEventListener('resize', ()=> this.setState({galleryWidth:this.getGalleryWidth()}));
    window.removeEventListener('scroll',this.scrollHandler.bind(this));
  }

  componentWillReceiveProps(props) {
    if(this.props.tag !== props.tag){
      this.setState({images: []})
    }
    this.getImages(props.tag);
  }

  updateNewGallery(newImagesArray){
    this.setState({images: newImagesArray});
  }

  scrollHandler(){
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    let clientHeight = document.documentElement.clientHeight || window.innerHeight;
    let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      if(this.state.loadImages){
        return;
      }
      this.getImages(this.props.tag);
      this.setState({loadImages:true})

    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      images: arrayMove(this.state.images, oldIndex, newIndex)
    });
  };

  render() {
    const SortableImage = SortableElement(Image);
    const SortableGallery = SortableContainer(() => {
      return (
        <div>
          {this.state.images.map((dto, index) => (
            <SortableImage key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} images={this.state.images} updateNewGallery={this.updateNewGallery.bind(this)} index={index}  />
          ))}
        </div>
      );
    });
    return (
      <div className="gallery-root">
         <SortableGallery images={this.state.images} axis={'xy'} pressDelay={150} onSortEnd={this.onSortEnd} />
        {(() => {
          if (this.state.loadImages) {
            return(
              <div className="data-loading">
              <FontAwesome className="image-icon" size="4x" name="sync-alt" spin/>
              </div>
            );
          }})()}
      </div>

    );
  }
}

export default Gallery;

