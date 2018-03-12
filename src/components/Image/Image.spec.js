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
  const targetsize = 200
  const deleteFunction = function (id) {

  }
  const mountImage = () => {
    return shallow(
      <Image dto={sampleImage} id={sampleImage.id} removeImage={deleteFunction} galleryWidth={galleryWidth}/>,
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
    console.log(imageSize);
    const remainder = Math.round(targetsize / imageSize);
    console.log(remainder);
    expect(remainder).to.be.equal(1);
  });
  it('image should be set to rotate 0 by default', () => {
    const imageTransition = wrapper.state().rotation;
    expect(imageTransition).to.be.equal(0);
  });

  it('when delete button is clicked delete image is called', () => {
    const spy = sinon.spy(Image.prototype, 'deleteImage');
    wrapper = mountImage();
    wrapper.find('.imageDelete').simulate('click');
    expect(spy.called).to.be.true;
  });

  it('when rotate button is clicked rotate function is called', () => {
    const spy = sinon.spy(Image.prototype, 'rotate');
    wrapper = mountImage();
    wrapper.find('.rotateImage').simulate('click');
    expect(spy.called).to.be.true;
  });
});
