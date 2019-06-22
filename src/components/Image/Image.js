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
      size: 200
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
  
  render() {
   const rotateAngle = this.props.dto.rotateAngle;
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${rotateAngle}deg)`
        }}
        >
        <div
         style={{
         transform: `rotate(-${rotateAngle}deg)`
        }}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.props.rotateClick}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete me" onClick={this.props.deleteClick}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.props.showLarge}/>
        </div>
      </div>
    );
  // }
  // return;
  }
}

export default Image;
