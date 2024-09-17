import PropTypes from 'prop-types';
import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './ContentSection.module.scss';
import { MusicNoticeIcon } from '~/components/Icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const ContentSection = ({ data }) => {
    return (
        <div className={cx('desc-main-content')}>
            <div className={cx('wrapper-main-content')}>
                <div style={{ maxHeight: 44 }} className={cx('div-text')}>
                    <div className={cx('overflow-container')}>
                        <div className={cx('wrapper-overflow')}>
                            <span className={cx('div-text-span')}>{data?.description}</span>
                            <br />
                            <Link className={cx('styled-common-link')}>
                                <strong className={cx('strong-text')}>#copyright_by_canhtv05</strong>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <h4 className={cx('h4-link')}>
                <Link className={cx('styled-h4-link')}>
                    <MusicNoticeIcon className={cx('music-notice-icon')} />
                    <div className={cx('div-music-text')}>{`${data?.music || 'copyright_by_canhtv05'}`}</div>
                </Link>
            </h4>
        </div>
    );
};

ContentSection.propTypes = {
    data: PropTypes.shape({
        description: PropTypes.string,
        music: PropTypes.string,
    }),
};

export default memo(ContentSection);
