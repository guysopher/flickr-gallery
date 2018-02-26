import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './BigImage.scss';

class BigImage extends React.Component {
    static propTypes = {
        dto: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    urlFromDto(dto) {
        return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
    }

    render() {
        if (!this.props.images.length) return null;
        return (
            <div style={{
                position: 'fixed',
                left:0,
                top:0,
                right:0,
                bottom:0,
                display:'flex',
                alignItems:'center',
                alignContent:'center',
                backgroundColor:'rgba(0,0,0,0.9)'
            }}>
                <FontAwesome style={{
                    position: 'absolute',
                    right:0,
                    top:0
                }}
                    className="image-icon" name="times" title="times" onClick={() => this.props.closeExpend()}></FontAwesome>
                {this.props.selectedImageIndex !== 0 &&
                <FontAwesome className="image-icon" name="arrow-left" title="arrow-left" onClick={() => this.props.selectImageExpend(this.props.selectedImageIndex-1)}></FontAwesome>
                    }
                <img style={{
                    margin:'auto'
                }}
                     src={this.urlFromDto(this.props.images[this.props.selectedImageIndex])}/>
                {this.props.selectedImageIndex !== this.props.images.length-1 &&
                <FontAwesome className="image-icon" name="arrow-right" title="arrow-right"
                             onClick={() => this.props.selectImageExpend(this.props.selectedImageIndex + 1)}></FontAwesome>
                }
            </div>
        )
    }
}

export default BigImage;

