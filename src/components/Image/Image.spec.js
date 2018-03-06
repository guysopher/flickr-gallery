// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1111;

  const mountImage = () => {
    return shallow(
      <Image dto={sampleImage} galleryWidth={galleryWidth}/>,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('render 3 icons on each image', () => {
    expect(wrapper.find('FontAwesome').length).to.equal(3);
  });

  it('calc image size on mount', () => {
    const spy = sinon.spy(Image.prototype, 'calcImageSize');
    wrapper = mountImage();
    expect(spy.called).to.be.true;
  });

  it('calculate image size correctly', () => {
    const imageSize = wrapper.state().size;
    const remainder = galleryWidth % imageSize;
    expect(remainder).to.be.lessThan(1);
  });

    it('check that image is enlarge by opening slider', () => {
        const spy = sinon.spy(Image.prototype, 'openSlider');
        expect(spy.called).to.be.true;
    });
    it('check that image rotation fuc is triggered on click', () => {
        const spy = sinon.spy(Image.prototype, 'rotateImg');
        const wrapper = mount(<Image/>);
        wrapper.find('#rotate-btn').simulate('click');
        expect(spy.called).to.be.true;
    });
    it('check that image rotation fuc is triggered on click', () => {
        const spy = sinon.spy(Image.prototype, 'deleteItem');
    const wrapper = mount(<Image/>);
    wrapper.find('#delete-btn').simulate('click');
    expect(spy.called).to.be.true;
    });

});
