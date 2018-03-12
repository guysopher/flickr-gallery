/****************************************************************************/
/*                                                                          */
/* This file contains the photo Gallery Component                           */
/*                                                                          */
/*                                                                          */
/****************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

/*
 * Gallery Component
 *
 * Tag- the current tag the user has requested images of
 * Images - A list consist the photo related to the tag
 * Gallery width- the width of the inner window
 * Pages count - A counting var which save the number of the photo need to be shown
 */
class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  /*
  * Constructor
  */
  constructor(props) {
    super(props);
    this.removeImage = this.removeImage.bind(this);
    this.updateGalleryWidth=this.updateGalleryWidth.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      pagesCount:100
    };
  }

  /*
  * getGalleryWidth-
  * returns the initial inner window width
  */
  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  /*
   * updateGalleryWidth-
   * Update the gallery width to the current inner window width
   */
  updateGalleryWidth(){
    console.log('update3 size')
    this.setState({galleryWidth: document.body.clientWidth})
  }

  /*
   * getImages - receives images from the flicker website according to the number of photos the user requested to see and
   * implanting it to the images list
   */
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.pagesCount}&format=json&nojsoncallback=1`;
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
  /*
   * handleScroll - An event handler which loads more photos as the user get to the bottom of the page
   */
  handleScroll() {
    console.log('handle log');
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({pagesCount: this.state.pagesCount + 100});
      console.log('pages count' + this.state.pagesCount);
      this.getImages(this.tag);
    }
  }

  /*
   * componentDidMount - Built in Function that invoked immediately after a component is mounted
   * in this function there is two event listener : one for scrolling and the second for resizing
   */
  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('resize',this.updateGalleryWidth)
    window.addEventListener('scroll',this.handleScroll)
  }

  /*
   * componentWillUnmount - Built in Function that invoked immediately before a component is unmounted
   * and destroyed.
   */
  componentWillUnmount(){
    window.removeEventListener('resize', this.updateGalleryWidth);
    window.removeEventListener('scroll',this.handleScroll)
  }

  /*
  * removeImage - This function triggers when the delete image button is pressed.
  * simply filter the deleted image from list of images by its id
  */
  removeImage(imageId){
    let images = this.state.images.filter(image => image.id !== imageId);
    this.setState({images});
  }

  /*
   * componentWillReceiveProps - In our case this function is here to update out images based on the tag
   */
  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  /*
   * render - In our case the render function create the images component based on the gallery data
   */
  render() {
    console.log('re render')
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} id={dto.id} dto={dto} galleryWidth={this.state.galleryWidth} removeImage={this.removeImage}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
