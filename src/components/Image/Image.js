import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    removeImage: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotate = this.rotate.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      buttonRotation: 0
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate(){
    let newRotation = this.state.rotation + 90;
    let buttonNewTranform = -1 * newRotation;
    if(newRotation >= 360) {
      newRotation = -360;
      buttonNewTranform = newRotation *-1;
    }
    this.setState({
      rotation: newRotation,
      buttonRotation: buttonNewTranform
    })
  }

  deleteImage() {
    const { removeImage } = this.props;
    removeImage(this.props.id);
  }

  render(){
    return (
      <div
        id={this.props.id}
        className="image-root"
        style={{
          transform: `rotate(${this.state.rotation}deg)`,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
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
