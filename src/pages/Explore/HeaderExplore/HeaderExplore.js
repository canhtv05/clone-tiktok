import React, { Component } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from './HeaderExplore.module.scss';

const cx = classNames.bind(styles);

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: 'block', background: 'red' }} onClick={onClick} />;
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: 'block', background: 'green' }} onClick={onClick} />;
}

function HeaderExplore() {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    return (
        <div className="slider-container">
            <div className={cx('header')}>
                <span>You may like</span>
            </div>
            <Slider {...settings}>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>1</h3>
                </div>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>2</h3>
                </div>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>3</h3>
                </div>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>4</h3>
                </div>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>5</h3>
                </div>
                <div style={{ backgroundColor: 'red', padding: '10px' }}>
                    <h3>6</h3>
                </div>
            </Slider>
        </div>
    );
}

export default HeaderExplore;
