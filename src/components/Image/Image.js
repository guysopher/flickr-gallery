import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    showFavorites: PropTypes.bool,
    galleryWidth: PropTypes.number,
    resetGallery: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0, // degrees to be rotated
      isFaved: false
    };
  }

  calcImageSize(galleryWidth) {
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    console.log("imagesPerRow= " + imagesPerRow);
    const size = (galleryWidth / imagesPerRow);
    console.log("size= " + size);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize(this.props.galleryWidth);
  }

  componentWillReceiveProps(props) {
    this.calcImageSize(props.galleryWidth); // update the size of the images

    /* if images will receive a true resetGallery prop then
       the 'favorite' button and rotation are reset */
    if (props.resetGallery){
      this.setState({
        isFaved: false, // all images are not favorited anymore
        rotation: 0 // all images are not rotated anymore
      });
    }
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  showImage() {
    /* show image only if 'show favorites' button is not active or if it's active and the image is favorited */
    return (!this.props.showFavorites || (this.props.showFavorites && this.state.isFaved));
  }

  render() {
    const rotation = this.state.rotation;
    const url = `${this.urlFromDto(this.props.dto)}`;
    
    return (
      <div
        id={this.props.dto.id}
        className= {rotation ? `image-root-rotated${rotation}` : "image-root"}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          display: this.showImage() ? 'inline-block' : 'none',
          transform: `rotate(${rotation}deg)`
        }}
        >
        <div>
          <FontAwesome 
            className="image-icon" 
            name="sync-alt" 
            title="rotate"
            onClick= {() => this.setState({ 
              // rotation by 90 degrees, rotation is ranged from 0 to 360 (excluded)
              rotation: (rotation + 90) % 360
            })}
          />
          <FontAwesome 
            className="image-icon" 
            name="trash-alt" 
            title="delete"
            onClick= {() => this.props.onDeleteClick()}
          />
          <FontAwesome 
            className="image-icon" 
            name="expand" 
            title="expand"
            onClick= {() => this.props.onExpandClick()}
          />
          <FontAwesome 
            className= {(this.state.isFaved) ? "image-icon-favorited" : "image-icon"}
            name="heart" 
            title="favorite"
            onClick= {() => this.setState({
              isFaved: !this.state.isFaved
            })}
          />
        </div>
      </div>
    );
  }
}

export default Image;
