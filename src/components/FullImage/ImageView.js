import React from 'react';
import './ImageView.scss';
import index from '../Image/index';



class ImageView extends React.Component {




  render() {

    return (
      <div
       className="ImageView"
       style={{
         width: '200%',
         height: '200%',
         zIndex: 99,
         position: 'absolute'

       }} ><img src={this.props.url}/>
       <a onClick={this.props.onClose} href="#">x</a>
       </div>
    )
  }
}

export default ImageView;
