import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import FontAwesome from 'react-fontawesome';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    showFavorites: PropTypes.bool,
    resetGallery: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      expand: false, // true if expand mode is on, otherwise false
      page: 0 // page number of tag search (for infinite scrolling)
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag, isScrollEvent) { // isScrollEvent is true in case of function invoked due to scrolling event
    const page = (isScrollEvent) ? this.state.page+1 : 1;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&page=${page}&per_page=100&format=json&nojsoncallback=1`;
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
          this.setState((prevState) => ({
            images: (isScrollEvent) ? prevState.images.concat(res.photos.photo) : res.photos.photo,
            page
          }));
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag, false);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('resize', () => this.setState({galleryWidth: this.getGalleryWidth()}));
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(props) {
   /* Get new images only if the tag has changed or reset button was pressed */
   if ((props.tag !== this.props.tag) || (props.resetGallery)){
     this.getImages(props.tag, false);
     this.props.turnOffReset();
   }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.setState({galleryWidth: this.getGalleryWidth()}));
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
      this.getImages(this.props.tag, true);
    }
  }

  handleDelete(index) {
    this.setState((prevState) => ({
      images: prevState.images.filter((_, i) => i !== index)
    }));
  }

  turnOffExpand() {
    this.setState(() => ({expand: false}));
  }

  turnOnExpand(dtoID, index) {
    /* Get the chosen image to expand and display it, as well as navigation arrows and close button. */
    const expandedImage = document.getElementById(dtoID);
    this.setState(() => ({
      expand: true,
      expandImageAt: index
    }));
   document.getElementById('expanded-image').style.backgroundImage = expandedImage.style.backgroundImage;
   document.getElementById('expanded-image').style.transform = expandedImage.style.transform; // keep the rotation
   this.displayArrowButtons(index);
  }

  displayArrowButtons(index) {
    /* If the first or the last images are expanded, then the relevant left/right buttons don't display.
       On 'show favorites' mode, navigation arrows are not displayed at all. */
    var leftButton = document.getElementsByClassName('expand-mode-button')[1];
    var rightButton = document.getElementsByClassName('expand-mode-button')[2];
    leftButton.style.display = (index === 0 || this.props.showFavorites) ?  'none' : 'block';
    rightButton.style.display = (index === this.state.images.length-1 || this.props.showFavorites) ?  'none' : 'block';
   }

  updateExpand(isNext) {
    /* On expand mode, in case of clicking the navigation arrows, update the expanded image accordingly. */
    const newImageIndex = (isNext) ? this.state.expandImageAt+1 : this.state.expandImageAt-1;
    const imageToExpand = document.getElementById(this.state.images[newImageIndex].id);
    document.getElementById('expanded-image').style.backgroundImage = imageToExpand.style.backgroundImage;
    document.getElementById('expanded-image').style.transform = imageToExpand.style.transform;
    this.setState(() => ({
      expandImageAt: newImageIndex
    }));
    this.displayArrowButtons(newImageIndex); // check whether both arrows need to be displayed with the new image
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto,index) => {
          return <Image
                  key={'image-' + dto.id}
                  dto={dto}
                  galleryWidth={this.state.galleryWidth}
                  onDeleteClick= {() => this.handleDelete(index)}
                  onExpandClick= {() => this.turnOnExpand(dto.id, index)}
                  showFavorites={this.props.showFavorites}
                  resetGallery={this.props.resetGallery}
                 />;
        })}
        <div className="gallery-expand-mode"
              style={{
                display: (this.state.expand) ? 'block' : 'none'
              }}
            >
            <img id="expanded-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                 />;
            <FontAwesome className="expand-mode-button" name="times-circle" title="close"
              style={{ // 'close' button is at the top right of the screen
                top: '0',
                right: '0'
              }}
              onClick= {() => this.turnOffExpand()}
            />
            <FontAwesome className="expand-mode-button" name="angle-left" title="previous"
              style={{ // left arrow is at the middle left side of the screen
                top: '50%',
                left: '0'
              }}
              onClick= {() => this.updateExpand(false)}
            />
            <FontAwesome className="expand-mode-button" name="angle-right" title="next"
              style={{ // right arrow is at the middle right side of the screen
                top: '50%',
                right: '0'
              }}
              onClick= {() => this.updateExpand(true)}
            />
        </div>
      </div>
    );
  }
}

export default Gallery;
