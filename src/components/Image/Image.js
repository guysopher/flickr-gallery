import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    openModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotateClicked = this.rotateClicked.bind(this);
    this.resize = this.resize.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      galleryWidth: props.galleryWidth
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth  / imagesPerRow) ;
    this.setState({
      size
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.setState({galleryWidth: this.props});
    this.calcImageSize();
  }

  resize(){
    this.setState({
      galleryWidth: this.props.galleryWidth
    });
   this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleDelClicked(){
    this.props.deleteImage(this.props.dto.id);
  }

  handleExpClicked(){
    this.props.openModal(this.props.dto.id);
  }

  //-------------------Rotate image function--------------------
  //This function rotate the image by 90 degrees each time the user press the rotate button
  //the image rotation is changes when we change the rotation state.

  rotateClicked(){
    let newRotation = (this.state.rotation + 90) % 360;

    this.setState({
      rotation: newRotation
    })
  }
  
  render() {
    //console.log(this.state.size);
    return (
      <div
        className="image-root"
        id = {this.props.dto.id}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transition: 'transform 1s',
          transform:`rotate(${this.state.rotation}deg)`
        }}
        >
        <div style= {{transform:`rotate(${-this.state.rotation}deg)`,transition: 'transform 1s'}}>
          
          <FontAwesome className="image-icon button" name="sync-alt" title="rotate" onClick = {this.rotateClicked} />
         
          <FontAwesome className="image-icon button" name="trash-alt" title="delete" onClick = {this.handleDelClicked.bind(this)}/>
        
          <FontAwesome className="image-icon" name="expand" title="expand" onClick = {this.handleExpClicked.bind(this)}/>
        </div>
      
      </div>
    );
  }
}

export default Image;
