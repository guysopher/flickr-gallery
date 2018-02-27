import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
//import InfiniteScroll from 'react-infinite-scroller'

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
	  imageNum: 100,
      galleryWidth: this.getGalleryWidth()
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
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.imageNum}&format=json&nojsoncallback=1`;
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
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
	
	document.addEventListener('scroll', this.trackScrolling);
  }
  isBottom(el) {
	return el.getBoundingClientRect().bottom <= window.innerHeight;
	}


	trackScrolling = () => {
	  const wrappedElement = document.getElementsByClassName('gallery-root')[0];
	  if (this.isBottom(wrappedElement)) {
		var n_imageNum = this.state.imageNum;
		n_imageNum += 100;
		this.setState({imageNum: n_imageNum});
		
		this.getImages(this.props.tag);
		this.forceUpdate();
	  }
	};

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root"
	  style={{          
          width: this.state.galleryWidth + 'px'        
		
        }}
	  >
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth}/>;
        })}
      </div>
    );
  }
}



export default Gallery;
