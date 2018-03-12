/****************************************************************************/
/*                                                                          */
/* This file contains the photo Image Component                             */
/*                                                                          */
/*                                                                          */
/****************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

/*
 * Image Component
 *
 * id- The id of the specific image
 * dto - An object which contains the image
 * Gallery width- the width of the inner window (getting it by props)
 * remove Image - A function we use to delete an image (getting it by props)
 * Size - the size (height and width) of the image
 * Rotation - A number that decide the degree of the photo
 * Button Rotation - an anti rotation helper to keep the button align
 */
class Image extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    removeImage: PropTypes.func
  };
  /*
   * Constructor
   */
  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotate = this.rotate.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.updateImageSize=this.updateImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      buttonRotation: 0
    };
  }
  /*
   * calcImageSize - Determines the size of each image for the initial data
   */
  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const sizeWithBorders = galleryWidth - imagesPerRow*2; //calculating the size of the gallery with the borders
    const size = sizeWithBorders /imagesPerRow ;
    console.log('calcImageSize')
    this.setState({
      size
    });
  }
  /*
   * updateImageSize - Determines the size of each image after changes has made
   */
  updateImageSize() {
    const {galleryWidth} = this.props;
    console.log('update gallery ' + galleryWidth)
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const sizeWithBorders = galleryWidth - imagesPerRow*2; //calculating the size of the gallery with the borders
    const size = sizeWithBorders /imagesPerRow ;
    console.log('update15 size ' + size)
    return size;
  }

  componentDidMount() {
    this.calcImageSize();
  }

  /*
   * urlFromDto - Changing the dto object to the image url (the fields are based on flickr api)
   */
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  /*
   * rotate - Rotate the image and saves the new degree after the user clicks
   */
  rotate(){
    let newRotation = this.state.rotation + 90;
    let buttonNewTranform = -1 * newRotation;
    if(newRotation >= 360) {
      newRotation = -360;
    }
    this.setState({
      rotation: newRotation,
      buttonRotation: buttonNewTranform
    })
  }
  /*
   * deleteImage - Passing the image id to the gallery remove function when the user clicks
   */
  deleteImage() {
    const { removeImage } = this.props;
    removeImage(this.props.id);
  }

  /*
   * render - In our case the render function updates the image size and print it on screen
   */
  render(){
    console.log('image render');
    return (
      <div
        id={this.props.id}
        className="image-root"
        style={{
          transform: `rotate(${this.state.rotation}deg)`,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.updateImageSize() + 'px',
          height:this.updateImageSize() + 'px'
        }}
      >
        <div style={{transform: `rotate(${this.state.buttonRotation}deg)`}}>
          <FontAwesome className="image-icon rotateImage" name="sync-alt" title="rotate" onClick={this.rotate}/>
          <FontAwesome className="image-icon imageDelete" name="trash-alt" title="delete" onClick={this.deleteImage}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
