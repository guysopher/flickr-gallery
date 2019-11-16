// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';

import LargeImage from './LargeImage.js';

describe('Test for LargeImage', () => {
    const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

    let wrapper;

    
  const mountImage = () => {
    return shallow(
         <LargeImage dto={sampleImage}/>, 
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };
  beforeEach(() => {
    wrapper = mountImage();
  });


  it('Large Image Renders', () => {
    expect(wrapper).to.not.be.undefined;
  });

});
