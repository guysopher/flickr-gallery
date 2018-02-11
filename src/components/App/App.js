import React from 'react';
import PropTypes from 'prop-types';
import s from './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      tag: 'art'
    };
  }

  render() {
    const {t} = this.props;

    return (
      <div className={s.root}>
        <div className={s.header}>
          <h2>{t('app.title')}</h2>
          <input className={s.input} onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
