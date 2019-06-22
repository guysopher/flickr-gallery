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
      rotation: 0
    };
    this.handleRotate = this.handleRotate.bind(this);
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

  handleRotate = () => {
    let newRotation = (this.state.rotation === 360) ? 0 : this.state.rotation;
    newRotation += 90;

    this.setState({
      rotation: newRotation
    })
  }

  render() {
    return (
      <div className="image-root">
        <img
          style={{transform: `rotate(${this.state.rotation}deg)`}}
          src={this.urlFromDto(this.props.dto)}
          width={this.state.size + 'px'}
          height={this.state.size + 'px'}
          >
        </img>
        <div>
            <FontAwesome onClick={this.handleRotate} className="image-icon" name="sync-alt" title="rotate"/>
            <FontAwesome onClick={this.props.onDelete} className="image-icon" name="trash-alt" title="delete"/>
            <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
