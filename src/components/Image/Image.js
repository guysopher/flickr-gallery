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
        this.deleteItem = this.deleteItem.bind(this);
        this.rotateImg = this.rotateImg.bind(this);
        this.openSlider = this.openSlider.bind(this);
        this.state = {
            size: 200,
            sizePercent: 0,
            rotationImg: 0,
            rotationBtn: 0,
        };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    const sizePercent = (size*100 / galleryWidth);
    this.setState({
        size:size
    });
    this.setState({
        sizePercent:sizePercent
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  deleteItem () {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  }

  rotateImg () {
    let Rotate = this.state.rotationImg + 90;
    this.setState({
        rotationImg: Rotate
    });
    this.setState({
        rotationBtn: Rotate*(-1)
    })
  }

  openSlider () {
     var index = parseInt(this.props.index);
     var url = this.urlFromDto(this.props.dto);
     this.props.startSlider(index,url);
  }


  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.sizePercent + '%',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotationImg}deg)`,
          }}
        >
        <div style={{transform: `rotate(${this.state.rotationBtn}deg)`}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateImg}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.deleteItem}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.openSlider}/>
        </div>
      </div>
    );
  }
}

export default Image;
