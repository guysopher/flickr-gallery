import React from 'react';
import './ImageView.scss';
import index from '../Image/index';
import FontAwesome from 'react-fontawesome';



class ImageView extends React.Component {




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
            backgroundColor: 'rgba(0,0,0, 0.6)',
            textAlign:'center',
            zIndex: 99,
            bottom: 0,
            transitionDuration: '3s',
            transitionProperty: 'background-color'

          // width: '100em',
          // height: '100em',
          // top: 0,
          // backgroundPosition: 'center',
          // zIndex: 99,
          // position: 'absolute',
          // border: '5px solid red'


      }}>


        <div class="image_Container" id="box_container">
          <img className="imgBox" src={this.props.url}/>
          <a className="closeBox close" onClick={this.props.onClose}>x</a>
          <ul>
            <il className="arrow"> <FontAwesome className="fa fa-arrow-circle-left try"/></il>
            <li className="arrow"> <FontAwesome className="fa fa-arrow-circle-right try"/> </li>
          </ul>
        </div>
    </div>

    )
  }
}

export default ImageView;
