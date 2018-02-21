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
      isSaved: false
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props.galleryWidth;
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
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div>
          <FontAwesome 
            className="image-icon" 
            name="sync-alt" 
            title="rotate"
          />
          <FontAwesome 
            className="image-icon" 
            name="trash-alt" 
            title="delete"
            onClick= {() => this.props.onDeleteClick()}
          />
          <FontAwesome 
            className="image-icon" 
            name="expand" 
            title="expand"
          />
          <FontAwesome 
            className= {(this.state.isSaved) ? "image-icon-saved" : "image-icon"}
            name="heart" 
            title="save"
            onClick= {() => this.setState({
              isSaved: !this.state.isSaved
            })}
          />
        </div>
      </div>
    );
  }
}

export default Image;
