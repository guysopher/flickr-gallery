import React from 'react';
import {urlFromDto} from '../../utils/dtoUtils'
import FontAwesome from 'react-fontawesome';
import './ExpandedImageView.scss';

class ExpandedImageView extends React.Component {

  componentDidMount(){
    document.addEventListener('keydown', this.keyDownHandler);
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  // Use arrow keys to navigate in the expanded view. ESC to exit
  keyDownHandler = (e) => {
    switch (e.keyCode){
        // "Escape"
        case(27): {
            this.closeView()
            return
        }
        // "ArrowRight"
        case(39): {
            if (this.props.imageIndex !== this.props.imageCount - 1) {
                this.selectNextImage()
            }
            return
        }
        // "ArrowLeft"
        case(37): {
            if(this.props.imageIndex !== 0) {
                this.selectPrevImage()
            }
            return
        }
    }
  }

 closeView = () => {
    this.props.onImageSelected ? this.props.onImageSelected(null) : null
  }

  selectNextImage = () => {
    this.props.onImageSelected ? this.props.onImageSelected(this.props.imageIndex + 1) : null
  }

  selectPrevImage = () => {
    this.props.onImageSelected ? this.props.onImageSelected(this.props.imageIndex - 1) : null
  }

  render() {
    return (
      <div className="expanded-image-view">
        <div className='image-container' style={{
          backgroundImage: `url(${urlFromDto(this.props.dto)})`,
          transform: `rotate(${this.props.imageAngle || 0}deg)`
        }}/>
       <FontAwesome className="exit-icon" name="times" title="close" onClick={this.closeView}/>
       <FontAwesome className="next-icon" name="arrow-right" data-hidden={this.props.imageIndex === this.props.imageCount - 1}
                    title="next" onClick={this.selectNextImage}/>
       <FontAwesome className="previous-icon" name="arrow-left"  data-hidden={this.props.imageIndex === 0}
                    title="previous" onClick={this.selectPrevImage}/>
      </div>
    );
  }
}

export default ExpandedImageView;
