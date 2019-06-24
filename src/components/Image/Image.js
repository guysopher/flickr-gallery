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
    this.state = {
      size: 200,
      isInitialized: true,
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
    this.setState({isInitialized: false})
    this.calcImageSize();
  }

  render() {
    const rotationAttribute = {'rotate': 0};

    if(this.state.isInitialized){
      rotationAttribute.disabled = true;
    }

    return (
      <div className="image-root">
        <img
        {...rotationAttribute}
        src={this.state.url}
        width={this.state.size + 'px'}
        height={this.state.size + 'px'}
        >
        </img>
        <div>
            <FontAwesome onClick={this.props.onRotate} className="image-icon" name="sync-alt" title="rotate"/>
            <FontAwesome onClick={this.props.onDelete} className="image-icon" name="trash-alt" title="delete"/>
            <FontAwesome onClick={this.props.onExpand} className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
