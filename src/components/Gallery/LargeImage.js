import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './LargeImage.scss';

class LargeImage extends React.Component {
    constructor(props) {
        super(props);
        this.calcImageSize = this.calcImageSize.bind(this);
        this.state = {
          size: this.calcImageSize
        };
      }
      
      calcImageSize(){
          try {
              return document.body.clientWidth;
            } catch (e) {
                return 1000;
            }
        }
        
        urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
    render(){
        return (
            <div
        className="LargeImage"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px'
          
        }}
        >
      
      </div>
        );
        
    }
}

export default LargeImage