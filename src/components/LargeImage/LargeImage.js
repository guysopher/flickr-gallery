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
            <div
             className="ImageLarge"
             style={{
             backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
              height: this.state.height + '%',
              width: this.state.width + '%'
             }}
             
             >
     <button className="closebtn" onClick={this.props.closeLarge}>X
     </button>
     <div className="clearfix"></div>
     <button className="button" style={{float: 'left'}} onClick={this.props.leftLarge}>    &lt; </button>
     
     <button className="button" style={{float: 'right'}}onClick={this.props.rightLarge}>    &gt; </button>
     
          </div>
        );
        
    }
}

export default LargeImage