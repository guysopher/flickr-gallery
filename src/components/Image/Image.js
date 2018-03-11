import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    size: PropTypes.number,
    onDelete: PropTypes.func,
    onExpand: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      angle: 0
    };

    this.rotate = this.rotate.bind(this);
  }

  static urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate() {
    this.setState({angle: (this.state.angle + 90) % 360 });
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${Image.urlFromDto(this.props.dto)})`,
          width: this.props.size + 'px',
          height: this.props.size + 'px',
          transform: `rotate(${this.state.angle}deg`
        }}
        >
        <div style={{transform: `rotate(-${this.state.angle}deg`}}>
          <div onClick={this.rotate}>
            <FontAwesome className="image-icon" name="sync-alt" title="rotate"/>
          </div>
          <div onClick={this.props.onDelete}>
            <FontAwesome className="image-icon" name="trash-alt" title="delete"/>
          </div>
          <div onClick={this.props.onExpand}>
            <FontAwesome className="image-icon" name="expand" title="expand"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Image;
