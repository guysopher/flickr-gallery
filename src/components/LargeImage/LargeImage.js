import React from 'react';
import './LargeImage.scss';

class LargeImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          dimensions: {}
          //  height:document.window.clientHeight
        };
      }
    
  
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
      }
    
      render(){
        return (
           <div className="ImageLarge">
             <div id="backgroundLarge" onClick={this.props.handleCloseLarge}></div>
               <img id="img"src={this.urlFromDto(this.props.dto)} />
     
              <button id="closebtn" className="button" onClick={this.props.handleCloseLarge}>X</button>
              <button id="button-left" className="button" onClick={this.props.handleLeftClick}>    &lt; </button>
              <button id="button-right" className="button" onClick={this.props.hangleRightClick}>    &gt; </button>
          </div>
        );
        
    }
}

export default LargeImage