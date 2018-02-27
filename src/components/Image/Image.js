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
      size: 200,
      angle: 0,
      showing: true,
      modalShowing: false
    };
  }

  calcImageSize() {
    const galleryWidth = window.innerWidth;
    const targetSize = 200;
    var imagesPerRow = Math.round(galleryWidth / targetSize);
    var newSize = (galleryWidth / imagesPerRow);
    this.setState({
      size: newSize
    });
  }

  componentDidMount() {
    //this.calcImageSize();
    window.addEventListener('resize', this.calcImageSize);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }



  render() {
    return ( <
      div className = "root" > <
      div className = "image-root"
      style = {
        {
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: 'rotate(' + this.state.angle + 'deg)',
          display: (this.state.showing ? 'inline-block' : 'none')
        }
      } >
      <
      div className = "button-layer"
      style = {
        {
          transform: 'rotate(' + (-1 * this.state.angle) + 'deg)'
        }
      } >
      <
      div >
      <
      FontAwesome className = "image-icon"
      name = "sync-alt"
      title = "rotate"
      onClick = {
        () => {
          this.setState({
            angle: this.state.angle + 90
          });
        }

      }
      / > <
      FontAwesome className = "image-icon"
      name = "trash-alt"
      title = "delete"
      onClick = {
        () => {
          this.setState({
            showing: !this.state.showing
          });
        }
      }
      / > <
      FontAwesome className = "image-icon"
      name = "expand"
      title = "expand"
      onClick = {
        () => {
          this.setState({
            modalShowing: true
          });
        }
      }
      / > < /div >
      <
      /div > < /
      div >

      <
      div className = "modal"
      style = {
        {
          display: (this.state.modalShowing ? 'block' : 'none')
        }
      }
      onClick = {
        () => {
          this.setState({
            modalShowing: false
          });
        }
      } >
      <
      img src = {
        this.urlFromDto(this.props.dto)
      }
      style = {
        {
          display: 'inline-block',
          height: '100%'
        }
      }
      / > < /div >
      <
      /div >
    );
  }



}

export default Image;
