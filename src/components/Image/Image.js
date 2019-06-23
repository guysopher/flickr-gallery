import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      url: this.props.url
    };
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

  handleRotate = () => {
    this.setState((prevState)=>({
      rotation: (prevState.rotation + 90) % 360
    }))
  }

  render() {
    return (
      <div className="image-root">
        <img
          style={{transform: `rotate(${this.state.rotation}deg)`}}
          src={this.state.url}
          width={this.state.size + 'px'}
          height={this.state.size + 'px'}
          >
        </img>
        <div>
            <FontAwesome onClick={this.handleRotate} className="image-icon" name="sync-alt" title="rotate"/>
            <FontAwesome onClick={this.props.onDelete} className="image-icon" name="trash-alt" title="delete"/>
            <FontAwesome onClick={this.props.onExpand} className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
