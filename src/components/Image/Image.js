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
	this.handleRotate = this.handleRotate.bind(this);
	this.urlFromDto = this.urlFromDto.bind(this);
    this.state = {
      size: 200,
	  rotateDeg: 0,
	  expand: false
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props.galleryWidth;
    const targetSize = this.state.size;
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
  
  /*wanted to do an animation but I am a web development noob!!... react virgin */
  handleRotate() {
	const newDeg = (this.state.rotateDeg + 90) === 360 ? 0 : this.state.rotateDeg + 90 ;
	const img = this.refs.image;
	img.style.transform = img.style.transform.replace(/[0-9]+/,newDeg);
	this.setState({
		rotateDeg: newDeg
	});
  }
  

  /* added style tags to buttons div to keep FontAwesome buttons aligned when rotating */
  render() {
	  const balanceRotation = `rotate(${this.state.rotateDeg * -1}deg)`;
    return (
      <div
        className= {'image-root'}
		ref= {'image'}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
		  transform: 'rotate(0deg)'
        }}>
        <div style={{transform: balanceRotation}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.handleRotate} />
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.sendToDelete(this.props.dto)}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => this.props.sendToExpand(this.props.dto)}/>
        </div>
      </div>
    );
  }
}

export default Image;