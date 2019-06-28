import React from 'react';
import './NoResultBox.scss';

class NoResultBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div className="no-result-root">
            <p>No results found<br/>
                <span>please try a different word</span>
            </p>
        </div>
      );
    }
}

export default NoResultBox;
