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
        rotate: 0
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    return (galleryWidth / imagesPerRow);
  }


  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate() {
    this.setState({
      rotate: (this.state.rotate + 90)
    })
  }

  render() {
    const size = this.calcImageSize()
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: size + 'px',
          height: size + 'px',
            transform: `rotate(${this.state.rotate}deg)`
        }}
        >
        <div
            className="icons"
            style={{
                transform: `rotate(-${this.state.rotate}deg)`
            }}
        >
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={()=> this.rotate()}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.delete(this.props.dto.id)}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={()=> this.props.openExpend(this.props.imageIndex)}/>
        </div>
      </div>
    );
  }
}

export default Image;

