import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
//import classnames from 'classnames';
//import Native from 'react-native';
//import {render} from 'react-dom';
//import Rotation from 'react-rotation';



class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    galleryHeigh: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0, // image rotation
      morotation: 0, //mouse over rotation
      classes:'image-root',     //make the div css as a object
      styles: {                 //style as a object, becouse we want to render the image size.
        backgroundImage: `url(${this.urlFromDto(this.props.dto)})`
      }
    };
    this.state.styles.width = this.state.size + 'px';
    this.state.styles.height = this.state.size + 'px';
  }



  calcImageSize() {
    var parent = this._reactInternalInstance._currentElement._owner._instance;   // Recive parent component container of gallery
    const galleryWidth = parent.getGalleryWidth();  // Recive the gallery width
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    //console.log('imagesPerRow',imagesPerRow);
    const size = (galleryWidth / imagesPerRow);
    var newStyle = this.state.styles;
    newStyle.width = `${size}px`;
    newStyle.height = `${size}px`;


    this.setState({
      size,
      styles: newStyle
  });
  }


  componentDidMount() {
   this.calcImageSize();
   // update the size in every window change
    window.addEventListener('resize', this.calcImageSize);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }


  removeImage(id){
    // Recive parent component container of gallery
    var gallery = this._reactInternalInstance._currentElement._owner._instance;

    // filter all images exclude our current id
    gallery.setState(prevState=>({
      images: prevState.images.filter(x=>x.id !== id)
    }))
  }

  rotateImage(){
    //console.log('rotate');
    let ImageRotation = this.state.rotation + 90;
    if(ImageRotation >= 360){
      ImageRotation =- 360;
    }
    let mouseOverRotation = this.state.morotation - 90;
    //console.log('mouseOverRotation',mouseOverRotation);
    if(mouseOverRotation <= -360){
      mouseOverRotation =+ 360;
    }
    this.setState({
      rotation: ImageRotation,
      morotation: mouseOverRotation
    })
  }


  // access(){
  //   var test = this._reactInternalInstance._currentElement._owner._instance;
  //   console.log(test);
  //   var gState=test.state;
  //   console.log(gState);
  //   var gWidth=gState.galleryWidth;
  //   var gHeigh=gState.galleryHeigh;
  //   //console.log(gWidth);
  //   var newWidth=gWidth*2;
  //   var newHeigh=gHeigh*2;
  //   var newState = gState;
  //   newState.galleryWidth = newWidth;
  //   newState.galleryHeigh = newHeigh;
  //   test.setState(prevState=>({
  //     state: prevState.state.change(x=>x.galleryWidth == newWidth)
  //   }))
  //   console.log(test);
  //
  //
  // }
  //
  // accessUpdate() {
  //   this.access();
  //   // update the size in every window change
  //   //window.addEventListener('resize', this.access);
  // }


expand(){
  var s = this.state.styles;
  //console.log(s)
  if(s.position == 'fixed'){
    s.width = this.state.size + 'px';
    s.height = this.state.size + 'px';
    delete s.position;
  }else{
    s.position = 'fixed'
    s.width = this.state.size * 3 + 'px';
    s.height = this.state.size * 3 + 'px';
  }
  //console.log(s)
   this.setState({
     styles: s
   })
}


  render() {
    const {rotation} =  this.state;
    const { morotation } = this.state;
    const {width} =this.state.styles;
    const {height}=this.state.styles;
    return (
      <div
        className={this.state.classes}
        style=
         {{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: width,
          height: height,
          transform: `rotate(${rotation}deg)`
        }}
        >
        <div style={{transform: `rotate(${morotation}deg)`}}>
          <FontAwesome onClick={()=>(this.rotateImage())} className="image-icon" name="sync-alt" title="rotate"/>
          <FontAwesome onClick ={()=>{this.removeImage(this.props.dto.id)}} className="image-icon" name="trash-alt" title="delete"/>
          <FontAwesome onClick={() => {this.expand()}} className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}



export default Image;
