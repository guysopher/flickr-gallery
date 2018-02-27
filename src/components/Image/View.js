import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';

class View extends React.Component {
  static propTypes = {
    shouldOpenView: PropTypes.bool,
    imagesForView: PropTypes.array,
    index: PropTypes.number,
    closeView: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      lightboxIsOpen: false,
      currentImageIndex: this.props.index
    };
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.getIndexOfImage = this.getIndexOfImage.bind(this);
    this.handleClickThumbnail = this.handleClickThumbnail.bind(this);
  }

  gotoPrevious() {
    let prevIndex = this.state.currentImageIndex - 1;
    if(this.state.currentImageIndex===0) {
      prevIndex = this.props.imagesForView.length - 1;
    }
      this.setState({
        currentImageIndex: prevIndex
      })
  }

  componentDidMount() {
  this.setState({
    lightboxIsOpen: this.props.shouldOpenView,
    currentImageIndex: this.props.index
  });
  }

  componentWillReceiveProps(props) {
    this.setState({
      lightboxIsOpen: props.shouldOpenView,
      currentImageIndex: props.index
    });
  }

  gotoNext() {
    let nextIndex = this.state.currentImageIndex + 1;
    if(this.state.currentImageIndex === this.props.imagesForView.length - 1) {
      nextIndex = 0;
    }
      this.setState({
        currentImageIndex: nextIndex
      })
  }

  getIndexOfImage(offset){
    const Index = this.state.currentImageIndex + offset;
    const len = this.props.imagesForView.length;
    if(Index < 0)return Index + len ;
    return (Index)%(len)
  }

  handleClickThumbnail(e){
    this.setState({
      currentImageIndex: this.getIndexOfImage(e-2)
    })
  }

  render() {
    if(this.props.imagesForView[this.getIndexOfImage(0)]===undefined)return null;
    return (
      <Lightbox
    images={[
      { src: this.props.imagesForView[this.getIndexOfImage(-2)]},
      { src: this.props.imagesForView[this.getIndexOfImage(-1)]},
      { src: this.props.imagesForView[this.getIndexOfImage(0)]},
      { src: this.props.imagesForView[this.getIndexOfImage(1)]},
      { src: this.props.imagesForView[this.getIndexOfImage(2)]}]}
    currentImage={2}
    showImageCount={false}
    isOpen={this.props.shouldOpenView}
    onClickPrev={this.gotoPrevious.bind(this)}
    onClickNext={this.gotoNext.bind(this)}
    onClose={this.props.closeView}
    backdropClosesModal={true}
    showThumbnails={true}
    onClickThumbnail={this.handleClickThumbnail.bind(this)}
    />
  )
  }
}

export default View;
