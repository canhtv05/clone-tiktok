import React from 'react';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { MusicNoticeIcon } from '~/components/Icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const ContentSection = () => (
    <div className={cx('desc-main-content')}>
        <div className={cx('wrapper-main-content')}>
            <div style={{ maxHeight: 44 }} className={cx('div-text')}>
                <div className={cx('overflow-container')}>
                    <div className={cx('wrapper-overflow')}>
                        <span className={cx('div-text-span')}>
                            nhìu lựa chọn để làm việc nè🥰🥰 kiếm tiền cùng mình nha
                        </span>
                        <Link className={cx('styled-common-link')}>
                            <strong className={cx('strong-text')}>#hustmedia</strong>
                        </Link>
                        <span> </span>
                        <Link className={cx('styled-common-link')}>
                            <strong className={cx('strong-text')}>#xhhhhhhhhhhhhhhhhhhhhhhh</strong>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <h4 className={cx('h4-link')}>
            <Link className={cx('styled-h4-link')}>
                <MusicNoticeIcon className={cx('music-notice-icon')} />
                <div className={cx('div-music-text')}>"想念"Emo Type Beat - 纯音乐 - 写在风中的信</div>
            </Link>
        </h4>
    </div>
);

export default ContentSection;
