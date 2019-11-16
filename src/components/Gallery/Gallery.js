import React from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Image from '../Image';
import ExpandedImageView from '../ExpandedImageView'

import './Gallery.scss';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      selectedImage: null,
      selectedImageAngle: 0,
      draggedImageIndex: null
    };
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
          this.setState({images: this.state.images.concat(res.photos.photo)});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);

    document.addEventListener('scroll', debounce(this.handleScroll, 500))
  }

  componentWillUnmount(){
    document.removeEventListener('scroll', this.handleScroll, false)
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  onDelete = index => {
    let cloned = this.state.images.slice()
    cloned.splice(index, 1)
    this.setState({images: cloned});
    
  }

  // Set the selected image index + rotation angle. null - no selection
  onImageSelected = (index = null, angle = 0) => {
    this.setState({selectedImage: index, selectedImageAngle: angle});
  }

  
  // Get more images only if the scroll is near the bottom of the window
  handleScroll = () => {
    if (window.scrollY + 1500 > this.galleryRootElement.scrollHeight) {
      this.getImages(this.props.tag);
    }
  }

  onDropImage = e => {
    // Check if the dropped component is valid
    if(e.target.id === '') {
      return
    }

    const droppedIndex = parseInt(e.target.id)

    // Check if we drag an image to a smaller index
    const isAfter = droppedIndex > this.state.draggedImageIndex

    const draggedImage = this.state.images[this.state.draggedImageIndex]

    let cloned = this.state.images.slice()

    // Insert the image after the dropped index location if the dragged image is smaller than the dropped index
    cloned.splice(isAfter ? droppedIndex + 1 : droppedIndex, 0, draggedImage);
    // Remove the dragged image from the array
    cloned.splice(isAfter ?  this.state.draggedImageIndex : this.state.draggedImageIndex + 1, 1)

    this.setState({draggedImageIndex: null, images: cloned})
  }

  onDragImage = draggedImageIndex => {
    this.setState({draggedImageIndex: draggedImageIndex})
  }

  render() {
    return (
      <div className="gallery-root" ref={galleryRootElement => this.galleryRootElement = galleryRootElement}>
        {this.state.images.map((dto, i) => {
          return <Image key={i} imageIndex={i} onDelete={this.onDelete} onDropImage={this.onDropImage}
                        onImageSelected={this.onImageSelected} onDragImage={this.onDragImage} dto={dto}/>;
        })}
        {this.state.selectedImage !== null && <ExpandedImageView dto={this.state.images[this.state.selectedImage]}
                                                                  imageAngle={this.state.selectedImageAngle}
                                                                  imageIndex={this.state.selectedImage}
                                                                  imageCount={this.state.images.length}
                                                                  onImageSelected={this.onImageSelected}/>}
      </div>
    );
  }
}

export default Gallery;
