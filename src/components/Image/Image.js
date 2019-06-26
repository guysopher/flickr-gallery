import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200
        };
  }

  calcImageSize() {
    const galleryWidth = document.body.offsetWidth;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();

    // set event handler for resize
    window.addEventListener('resize', this.calcImageSize.bind(this));
  }


  componentWillUnmount() {
    // remove event handler for resize
    window.removeEventListener('resize', this.calcImageSize.bind(this));
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
  // handle of Image - pass the id of the image to the dropped
  handleDragImage(e) {
    e.dataTransfer.setData('text', this.props.dto.id);
  }
  
  handleDrop(e) {
    var draggedId = e.dataTransfer.getData('text');
    
    // pass the id's to the parent (Gallery) in order to update the array
    this.props.handleDrag(draggedId, this.props.dto.id);
    
    this.props.handleDragMessage();
   }

  render() {
  // getting rotataAngle if it is defined, otherwise = 0
  const rotateAngle = this.props.dto.rotateAngle? this.props.dto.rotateAngle : 0;
    return (
        <div
          className="image-root" title="you can drag me"
          draggable
          onDragStart={(e) => this.handleDragImage(e)}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => this.handleDrop(e)}
          style={{
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            width: this.state.size + 'px',
            height: this.state.size + 'px',
            transform: `rotate(${rotateAngle}deg)`
          }}
          >
          <div
          style={{
          transform: `rotate(-${rotateAngle}deg)`
          }}>
            <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.props.handleRotate}/>
            <FontAwesome className="image-icon" name="trash-alt" title="delete me" onClick={this.props.handleDelete}/>
            <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.props.handleEnlarge}/>
          </div>
        </div>
    );
  // }
  // return;
  }
}

export default Image;
