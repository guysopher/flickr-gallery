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
    const targetSize = 200;
    const imagesPerRow = Math.round(document.body.clientWidth / targetSize);
    const size = (document.body.clientWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
     window.addEventListener('resize', this.calcImageSize.bind(this));
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

   onExpandClicked(e) {
     var url = this.urlFromDto(e.props.dto);
     this.props.callbackParent(url);
    }
  render() {
    var angle = 90;
    var deleteImg = e =>{
      e.target.parentNode.parentNode.style.display ='none';
    }
    var rotateImg = e =>{
      e.target.parentNode.parentNode.style.transform ='rotate(' + angle + 'deg)';
      e.target.parentNode.style.transform ='rotate(-' + angle + 'deg)';
      angle += 90;
    }

    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div className = "buttons">
          <FontAwesome onClick = {rotateImg} className="image-icon" name="sync-alt" title="rotate"/>
          <FontAwesome onClick = {deleteImg} className="image-icon" name="trash-alt" title="delete"/>
          <FontAwesome onClick ={() => this.onExpandClicked(this)} className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
