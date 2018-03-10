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
      angle: 0
    };

    this.rotate = this.rotate.bind(this);
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.floor(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({size: size});
  }

  componentDidMount() {
    this.calcImageSize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.galleryWidth !== this.props.galleryWidth) {
      this.calcImageSize();
    }
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate() {
    this.setState({angle: (this.state.angle + 90) % 360 });
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.angle}deg`
        }}
        >
        <div style={{transform: `rotate(-${this.state.angle}deg`}}>
          <div onClick={this.rotate}>
            <FontAwesome className="image-icon" name="sync-alt" title="rotate"/>
          </div>
          <div onClick={this.props.onDelete}>
            <FontAwesome className="image-icon" name="trash-alt" title="delete"/>
          </div>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
