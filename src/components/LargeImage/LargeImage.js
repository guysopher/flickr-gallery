import React from 'react';
import './LargeImage.scss';

class LargeImage extends React.Component {
  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
          dimensions: {}
          //  height:document.window.clientHeight
        };
      }
      
      calcImageSize(url) {
        
        // alert(url.offsetHeight);
      }
      
      
      
      urlFromDto(dto) {
        return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
      }
      render(){
        return (
           <div className="ImageLarge">
             <div id="backgroundLarge" onClick={this.props.closeLarge}></div>
               <img id="img"src={this.urlFromDto(this.props.dto)} />
     
              <button id="closebtn" className="button" onClick={this.props.closeLarge}>X</button>
              <button id="button-left" className="button" onClick={this.props.leftLarge}>    &lt; </button>
              <button id="button-right" className="button" onClick={this.props.rightLarge}>    &gt; </button>
          </div>
        );
        
    }
}

export default LargeImage