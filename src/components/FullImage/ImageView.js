import React from 'react';
import './ImageView.scss';
import FontAwesome from 'react-fontawesome';



class ImageView extends React.Component {

   getUrl = () =>{
      return `https://farm${this.props.dto.farm}.staticflickr.com/${this.props.dto.server}/${this.props.dto.id}_${this.props.dto.secret}.jpg`;

   }
 componentWillMount(){
  this.setArrows();
 }

 componentWillReceiveProps() {
   this.setArrows();
 }


   setArrows = () =>  {

      for( let i = 0; i < this.props.images.length; i++){
      if(this.props.images[i].id === this.props.dto.id){
          this.setState ({
            next: i !== this.props.images.length - 1 ? this.props.images[i + 1]: this.props.images.length[0],
            previews: i !== 0 ? this.props.images[i - 1]: this.props.images[this.props.images.length - 1]
          });
      }
    }
   }
   goNext = () => {
     this.props.openImage(this.state.next);
   }
   goPreviews = () => {
      this.props.openImage(this.state.previews);
   }
  render() {


    return (

      <div
        className="ImageView"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0, 0.5)',
            textAlign:'center',
            zIndex: 99,
            bottom: 0,
            transitionDuration: '3s',
            transitionProperty: 'background-color'

      }}>


        <div className="image_Container" id="box_container">
        <a className="closeBox close" onClick={this.props.onClose}>x</a>

          <img className="imgBox" src={this.getUrl()}/>
          <ul>
            <il className="arrow"> <FontAwesome name="previews" onClick={this.goPreviews} className="fa fa-arrow-circle-left try"/></il>
            <li className="arrow"> <FontAwesome name="next" onClick={this.goNext} className="fa fa-arrow-circle-right try"/> </li>
          </ul>
        </div>
    </div>

    )
  }
}

export default ImageView;
