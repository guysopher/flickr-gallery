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
    this.rotate = this.rotate.bind(this);
    this.state = {
                  rotation: 0,
      size: 200
    }
  }

 
  calcImageSize() {
    //const {galleryWidth} = this.props;
const galleryWidth = document.body.clientWidth;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);              
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  resize(){
  this.calcImageSize();
  }

  componentDidMount() {
    this.calcImageSize();
window.addEventListener("resize", this.resize.bind(this));
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

 rotate(){
    let newRotation = this.state.rotation + 90;
    if(newRotation >= 360){
      newRotation = 0;
    }
    this.setState({
      rotation: newRotation
    })
  }

  render() {
                const { showing } = this.state;
                const { rotation } =  this.state;
    return (
      <div
        className="image-root"
        style={{
                                  display: (showing ? 'none' : 'inline-block'),
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size,
          height: this.state.size + 'px',
                                  transform: `rotate(${rotation}deg)`
        }}
        >
        <div style={{transform: `rotate(${rotation*3}deg)`}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotate}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.setState({ showing: !showing })}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

 export default Image;
