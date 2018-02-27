// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
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
    expect(wrapper.find('FontAwesome').length).to.equal(4);
  });

  it('delete button work correctly',() =>{
    let clicked = false;
    const wrapper = shallow(<Image
      removeImage={()=> clicked=true}
      dto={sampleImage}
      galleryWidth={galleryWidth}
    />);
    expect(clicked).to.be.false;
    wrapper.find({ className: 'image-icon' }).at(1).simulate('click');
    expect(clicked).to.be.true;
  });

  it('expand button work correctly',() =>{
    let clicked = false;
    const wrapper = shallow(<Image
      openView={()=> clicked=true}
      dto={sampleImage}
      galleryWidth={galleryWidth}
    />);
    expect(clicked).to.be.false;
    wrapper.find({ className: 'image-icon' }).at(2).simulate('click');
    expect(clicked).to.be.true;
  });

  it('Pin button work correctly',() =>{
    let clicked = false;
    const wrapper = shallow(<Image
      pinImage={()=> clicked=true}
      dto={sampleImage}
      galleryWidth={galleryWidth}
    />);
    expect(clicked).to.be.false;
    wrapper.find({ className: 'image-icon' }).at(3).simulate('click');
    expect(clicked).to.be.true;
  });

  it('check rotate 90 degree every click',() =>{
    const wrapper = shallow(<Image
      dto={sampleImage}
      galleryWidth={galleryWidth}
    />);

    expect(wrapper.find({ className: 'image-root' }).prop('style')).to.have.property('transform','rotate(0deg');
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.find({ className: 'image-root' }).prop('style')).to.have.property('transform','rotate(90deg');
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.find({ className: 'image-root' }).prop('style')).to.have.property('transform','rotate(180deg');
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.find({ className: 'image-root' }).prop('style')).to.have.property('transform','rotate(270deg');
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.find({ className: 'image-root' }).prop('style')).to.have.property('transform','rotate(360deg');
  });

  it('check rotation state',() =>{
    const wrapper = shallow(<Image
      dto={sampleImage}
      galleryWidth={galleryWidth}
    />);

    expect(wrapper.state('rotation')).to.equal(0);
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.state('rotation')).to.equal(90);
    wrapper.find({ className: 'image-icon' }).at(0).simulate('click');
    expect(wrapper.state('rotation')).to.equal(180);
  });

});
