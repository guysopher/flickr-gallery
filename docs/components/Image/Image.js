import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
//import LightBox from 'react-lightbox-component';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
	
	this.deleteImage = this.deleteImage.bind(this);//
    this.rotateImage = this.rotateImage.bind(this);//
	
    this.state = {
      size: 200,
	   showView: true,//
	  
      rotation: 0//
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
	  
	  if(this.state.showView){//
		  
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
		  transform: 'rotate('+this.state.rotation+'deg)'
		
        }}
        >
        <div
		style={{         
		  transform: 'rotate(-'+this.state.rotation+'deg)'		
        }}
		>
          <FontAwesome className="image-icon" onClick={this.rotateImage} name="sync-alt" title="rotate"/>
          <FontAwesome className="image-icon" onClick={this.deleteImage} name="trash-alt" title="delete"/>
          <FontAwesome className="image-icon" onClick={this.expandImage}name="expand" title="expand"/>
		  
        </div>
		
      </div>
    );
  }
  return(<div></div>);
}
deleteImage(){
     this.setState({
      showView: false
    });
  }

  rotateImage(){
    var n_rotation = this.state.rotation;
    n_rotation += 90;
    this.setState({
      rotation: n_rotation
	  
    });
  }
  expandImage(){//
     this.setState({
	
	  
    });
  }
}
export default Image;
