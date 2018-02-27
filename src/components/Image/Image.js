import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    imageSize: PropTypes.number,
    pin: PropTypes.bool,
    removeImage: PropTypes.func,
    openView: PropTypes.func,
    pinImage: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      size: 200,
      rotation: 0
    };
  }

  componentDidMount() {
    this.setState({
      size: this.props.imageSize
    });
  }

  componentWillReceiveProps() {
    this.setState({
      size: this.props.imageSize
    });
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg`
        }}
      >
        <div className={'buttons'} style={{transform: `rotate(${-1*this.state.rotation}deg`}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate"
                       onClick={() => this.setState({rotation: this.state.rotation + 90})}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete"
                       onClick={this.props.removeImage}/>
          <FontAwesome className="image-icon" name="expand" title="expand"
                       onClick={this.props.openView}/>
          <FontAwesome style={{display: this.props.pin ? 'none':'inline-block'}} className="image-icon" name="thumbtack" title="pin"
                       onClick={this.props.pinImage}/>
        </div>
      </div>
    );
  }
}

export default Image;
