import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import LightBox from 'react-image-lightbox';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      photoIndex :0,
      isExpandMode: false
    };
  }

  calcImageSize(galleryWidth) {
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize(this.props.galleryWidth);
  }

  componentWillReceiveProps(props) {
    this.calcImageSize(props.galleryWidth);

  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  
  rotateImage(){
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation =- 360;
    }
    this.setState({
      rotation: newRotation
    })
  }
  
  deleteImage(){
    const id = this.props.dto.id;
    const newImagesArr = this.props.images.filter(image => image.id !== id);
    this.props.updateNewGallery(newImagesArr);
  }
  
  expandImage(){
    this.setState({isExpandMode:true,photoIndex: this.props.images.findIndex(image => image.id === this.props.dto.id)})

  }

  render() {
    const {isExpandMode ,photoIndex} = this.state;
    return (
      <div
        className="image-root"  style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg)`
        }}
      >
        <div style={{transform: `rotate(${-this.state.rotation }deg)`}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateImage.bind(this)}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.deleteImage.bind(this)}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.expandImage.bind(this)}/>
          {isExpandMode &&(
            <LightBox
              imageTitle={this.props.images[photoIndex].title}
              mainSrc={`${this.urlFromDto(this.props.images[photoIndex])}`}
              nextSrc={`${this.urlFromDto(this.props.images[(photoIndex + 1) % this.props.images.length])}`}
              prevSrc={`${this.urlFromDto(this.props.images[(photoIndex + this.props.images.length - 1) % this.props.images.length])}`}
              onCloseRequest={() => this.setState({ isExpandMode: false })}
              onMovePrevRequest={() => this.setState({photoIndex: (photoIndex + this.props.images.length - 1) % this.props.images.length})}
              onMoveNextRequest={() => this.setState({photoIndex: (photoIndex + 1) % this.props.images.length})}
              clickOutsideToClose={true}
              animationOnKeyInput={true}
            />)}
        </div>
      </div>

    );
  }


}

export default Image;
