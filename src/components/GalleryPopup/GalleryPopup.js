import React from 'react';
import PropTypes from 'prop-types';
import './GalleryPopup.scss';
import Image from '../Image';

class GalleryPopup extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onClose: PropTypes.func
  };

  render() {
    return (
      <div className="gallery-popup ">
        <button onClick={this.props.onPrev}>&lt;</button>
        <div style={{backgroundImage: `url(${Image.urlFromDto(this.props.dto)})`}} />
        <button onClick={this.props.onNext}>&gt;</button>
        <button className="close-button" onClick={this.props.onClose}>&times;</button>
      </div>
    );
  }
}

export default GalleryPopup;
