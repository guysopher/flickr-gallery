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
      size: '20%',
      rotation: 0,
      display: "inline-block"
    };

    this.rotate = this.rotate.bind(this);
    this.delete = this.delete.bind(this);
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const size = galleryWidth * 0.12;
    this.setState({
      size
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.calcImageSize);
  }

  componentWillMount() {
    this.calcImageSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calcImageSize);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate(){
    let newRotation = this.state.rotation + 90;

    this.setState({
      rotation: newRotation,
    })
  }

  delete() {
    this.setState({
      display: "none"
    })
  }

  render() {
    const { rotation } =  this.state;
    return (
      <div
        className="image-root"
        style={{
          display: `${this.state.display}`,
          transform: `rotate(${rotation}deg)`,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
           height: this.state.size + 'px'
        }}
        >
        <div
          style={{
            transform: `rotate(${rotation * -1}deg)`}}
          >
          <FontAwesome onClick={this.rotate} className="image-icon" name="sync-alt" title="rotate"/>
          <FontAwesome onClick={this.delete} className="image-icon" name="trash-alt" title="delete"/>
          <a href={this.urlFromDto(this.props.dto)} data-lightbox="mygallery"><FontAwesome className="image-icon" name="expand" title="expand"/></a>
        </div>
      </div>
    );
  }
}

export default Image;
