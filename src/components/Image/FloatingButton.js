import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './FloatingButton.scss'

class FloatingButton extends React.Component {
	static propTypes = {
		handleClick: PropTypes.func
  };
  
  constructor(props) {
	  super(props);
  }
  
  render() {
	  return (
	  <FontAwesome className="float" name="undo-alt" title="undo" onClick={() =>  this.props.handleClick() } />
	  );
  }
}
	  
export default FloatingButton;
