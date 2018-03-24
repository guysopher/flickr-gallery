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
      rotatation: 0
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  calcImageSize() {
    const galleryWidth = this.getGalleryWidth();
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
    window.addEventListener('resize', this.calcImageSize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.calcImageSize);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div className="img" style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          transform: `rotate(${this.state.rotatation*90}deg)`
        }}></div>
        <div className="buttons">
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={event=>{
            this.setState({rotatation:this.state.rotatation+1})
          }}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={event => {
            this.props.deleteImage(this.props.index);
          }}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
