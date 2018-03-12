import {configure, shallow}from 'enzyme';
import Adaper from 'enzyme-adapter-react-16';
import Gallery from './Gallery';
import React from 'react';
import Image from '../Image/Image';

configure({adapter: new Adaper()});

describe('removeImage', () => {
 it('it should rovmoe image from the gallery', () => {
    const wrapper = shallow(<Gallery/>);
    expect(wrapper.find(image)).toHaveLenght(100);
 });
});
