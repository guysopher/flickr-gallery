import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import ImageView from '../FullImage/ImageView';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      degree: 0,
      expanded: false
    };
  }
  // Delete event:
  onDeleteEventHandler = () =>{
   // alert('alert');
    this.props.removeImage(this.props.dto.id);
  }
  // Rotate Image
  onRotateEventHandler = () => {
    // alert('rotate');
    this.state.degree = this.state.degree +  90;
    this.setState(this.state);
  }

  // Expand Image
  onExpandEventHandler= () => {
    // alert('EXPAND');
    this.state.expanded = true;
    this.setState(this.state);
  }
  closeExpanded = () =>{
    alert('close');
    this.state.expanded = false;
    this.setState(this.state);

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
    return (
      <div
       className="image-root"
         style={{
           width: this.state.size + 'px',
           height: this.state.size + 'px'
         }}
        >

        <img
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.degree}deg)`,
          margin: 0
        }}/>
        <div>
          <FontAwesome onClick={this.onRotateEventHandler}className="image-icon" name="sync-alt" title="rotate"/>
          <FontAwesome onClick={this.onDeleteEventHandler} className="image-icon" name="trash-alt" title="delete"/>
          <FontAwesome onClick={this.onExpandEventHandler} className="image-icon" name="expand" title="expand"/>
        </div>
        {
          this.state.expanded ?
          <ImageView url={this.urlFromDto(this.props.dto)} onClose={this.closeExpanded.bind(this)}></ImageView>:''
        }
      </div>
    );
  }
}

export default Image;
