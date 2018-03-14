import React from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

class Modal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    imageToShow: PropTypes.array,
    nextImage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  urlFromDto(imageToShow) {
    return `https://farm${imageToShow.farm}.staticflickr.com/${imageToShow.server}/${imageToShow.id}_${imageToShow.secret}.jpg`;
  }

  handleNextClicked(e){
    if(e.target.className === 'next')
      this.props.nextImage(1);
    if(e.target.className === 'prev')
      this.props.nextImage(-1);
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    return (
      <div className="backdrop backdrop-style">

        <div className="modal modal-style ">

          <span className="close cursor" onClick={this.props.onClose}>&times;</span>
          <img className = "modal-content" key = {this.urlFromDto(this.props.imageToShow[2])} src = {this.urlFromDto(this.props.imageToShow[2])}/>
          <div id="caption" >{this.props.imageToShow[2].title}</div>
          <a className="prev" onClick={this.handleNextClicked.bind(this)}>❮</a>
          <a className="next" onClick={this.handleNextClicked.bind(this)}>❯</a>

          <div className = "row slider-preview">

            {this.props.imageToShow.map(image => { return <div className = "column" key = {this.urlFromDto(image)}>
            <img className = "column-image" src = {this.urlFromDto(image)}/>;</div> })}

        </div>
      </div>
    </div>
    );
  }
}

export default Modal;
