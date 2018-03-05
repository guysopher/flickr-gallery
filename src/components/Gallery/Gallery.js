import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Slider from 'react-image-slider';
//import './Slider';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
        this.removeItem = this.removeItem.bind(this);
        this.startSlider = this.startSlider.bind(this);
        this.stopSlider = this.stopSlider.bind(this);
        this.nextImg = this.nextImg.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
           images: [],
           galleryWidth: this.getGalleryWidth(),
           showSlider: false,
           currentIndex: '',
           imageToStartUrl: '',
           page: 1
        };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${this.state.page}&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {

          this.setState({images: this.state.images.concat(res.photos.photo)});
            console.log(this.state.images);
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll () {
    var d = document.documentElement;
    var offset = d.scrollTop + window.innerHeight;
    var height = d.offsetHeight;

    if (offset === height) {
        this.setState({page: ++this.state.page});
        console.log('At the bottom');
        console.log(this.state.page);
        this.getImages(this.props.tag);
    }
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  removeItem (i) {
    var UpdatedImgArr = this.state.images.slice(); //making shallow copy of the array
    UpdatedImgArr.splice(i, 1); //removing the item
    this.setState({images: UpdatedImgArr}); //update state
  }

  startSlider(index,url) {
    this.setState({showSlider: true});
    this.setState({currentIndex: index});
    this.setState({imageToStartUrl: url});
  }

  stopSlider() {
    this.setState({showSlider: false});
  }

  nextImg =() => {
    this.setState({currentIndex: ++this.state.currentIndex});
    this.setState({imageToStartUrl: this.refs.child.urlFromDto(this.state.images[this.state.currentIndex])});
    console.log(this.state.currentIndex);
    console.log(this.state.imageToStartUrl);
  }


  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, index) => {
          return <Image ref="child" key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} index={index} removeItem={this.removeItem} startSlider={this.startSlider}/>;
        })}
        <div className={this.state.showSlider ? '' : 'hidden'}>
            <div className="slider">
                <img className="slider-img" src={this.state.imageToStartUrl}/>
              <div className="actions">
                <button className="close" onClick={this.stopSlider}>Close</button>
                <button className="next" onClick={this.nextImg}>Next</button>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
