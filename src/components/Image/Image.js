import React from 'react';
import FontAwesome from 'react-fontawesome';
import {urlFromDto} from '../../utils/dtoUtils'

import './Image.scss';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.deleteImage = this.deleteImage.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.expandImage = this.expandImage.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.onDrag = this.onDrag.bind(this)
    this.state = {
      angle: 0
    };
  }

  // Deletes the image by the given index
  deleteImage() {
    this.props.onDelete ? this.props.onDelete(this.props.imageIndex) : null
  }

  // Rotates the image by 90 degree
  rotateImage() {
    const newAngle = this.state.angle + 90
    this.setState({angle: newAngle === 360 ? 0 : newAngle })
  }

  // Expand the image to a larger view
  expandImage() {
    this.props.onImageSelected ? this.props.onImageSelected(this.props.imageIndex, this.state.angle) : null
  }

  allowDrop(e) {
    e.preventDefault();
  }

  // Drag the image by its index
  onDrag () {
    this.props.onDragImage ? this.props.onDragImage(this.props.imageIndex) : null
  }

  render() {
    return (
      <div
      draggable="true"
      id={this.props.imageIndex}
      className="image-root"
      style={{
        backgroundImage: `url(${urlFromDto(this.props.dto)})`,
        transform: `rotate(${this.state.angle}deg)`
      }}
      onDrop={this.props.onDropImage}
      onDragOver={this.allowDrop}
      onDragStart={this.onDrag}>
        <div style={{
          transform: `rotate(-${this.state.angle}deg)`
        }}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateImage}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.deleteImage}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.expandImage}/>
        </div>
      </div>
    );
  }
}

export default Image;
