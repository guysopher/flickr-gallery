import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';





class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    Myfunc: PropTypes.func
  
    
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
   
    this.state = {
      size: 200,
      angle: 0
    
    };
    
    this.turnImage = this.turnImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.expendImage = this.expendImage.bind(this);
    
    
  }

  calcImageSize() {
   
    const {galleryWidth} = this.props;
    const targetSize = 200;
    
    const imagesPerRow =(galleryWidth / targetSize);
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



  turnImage() {
    this.state.angle = (this.state.angle + 90) % 360;
    var temp = document.getElementById(this.props.dto.id);
    temp.style.transform = 'rotate(' + this.state.angle.toString() + 'deg)';
    temp.children.item(0).style.transform = 'rotate(' + (this.state.angle * (-1)).toString() + 'deg)';

  }

  deleteImage() {

    var temp = document.getElementById(this.props.dto.id);
    temp.style.display = 'none';
   
    
  }



  expendImage() {
    
    this.props.Myfunc(this.props.dto.id);
    


  }



  render() {



    return (
      <div id={this.props.dto.id}
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
      >

        <div>
          <FontAwesome onClick={this.turnImage} className="image-icon" name="sync-alt" title="rotate" />
          <FontAwesome onClick={this.deleteImage} className="image-icon" name="trash-alt" title="delete" />
          <FontAwesome onClick={this.expendImage} className="image-icon" name="expand" title="expand" />
        </div>
      </div>
    );
  }
}

export default Image;
