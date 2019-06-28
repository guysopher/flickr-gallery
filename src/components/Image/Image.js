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
    this.state = {
      isInitialized: true,
      url: this.props.url
    };
  }

  componentDidMount() {
    this.setState({isInitialized: false})
  }

  render() {
    const rotationAttribute = {'rotate': 0};

    if(this.state.isInitialized){
      rotationAttribute.disabled = true;
    }

    return (
      <div className="image-root"
        onDragStart={this.props.onDragStart}
        onDragOver={this.props.onDragOver}
        onDrop={this.props.onDrop}
        draggable={true}
      >
        <img
          {...rotationAttribute}
          style={{
            backgroundImage: `url(${this.state.url})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
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
