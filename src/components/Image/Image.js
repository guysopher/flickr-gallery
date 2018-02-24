import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
    };
  }

  calcImageSize(width) {
    const galleryWidth = width;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    if (this.props.galleryWidth > document.body.clientWidth) {
      this.calcImageSize(document.body.clientWidth);
    } else {
      this.calcImageSize(this.props.galleryWidth);
    }
  }

  componentWillReceiveProps(props) {
    this.calcImageSize(props.galleryWidth);
  }

  rotateImg90deg() {
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation =- 360;
    }
    this.setState({
      rotation: newRotation,
    })
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg)`
        }}
        >
        <div
          className="icons-container"
          style={{
            transform: `rotate(${this.state.rotation * -1}deg)`
        }}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => this.rotateImg90deg()}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.deleteImage(this.props.dto.id)}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
