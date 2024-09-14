import React, { memo } from 'react';
import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ActionButtons.module.scss';
import Button from '~/components/Button';
import { HeartFillIcon, MessageFillIcon, FavoritesFillIcon, ShareFillIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { centerRowItems } from '../MenuItem';
import { renderShareTippy } from '../TippyRenders';

const cx = classNames.bind(styles);

const ActionButtons = ({ data }) => {
    return (
        <div className={cx('main-content')}>
            <div className={cx('main-content-wrapper')}>
                <div className={cx('flex-center-row')}>
                    <div className={cx('center-row')}>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button circle midIcon={<HeartFillIcon />} className={cx('button-icon')} />
                            <strong className={cx('strong-center-row')}>{data?.likes_count}</strong>
                        </div>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button circle midIcon={<MessageFillIcon />} className={cx('button-icon')} />
                            <strong className={cx('strong-center-row')}>{data?.comments_count}</strong>
                        </div>
                        <div className={cx('wrapper-button-center-row')}>
                            <Button circle midIcon={<FavoritesFillIcon />} className={cx('button-icon')} />
                            <strong className={cx('strong-center-row')}>{data?.shares_count}</strong>
                        </div>
                    </div>
                    <div className={cx('center-row')}>
                        {centerRowItems.map((item, index) => (
                            <div key={index} className={cx('share-link')}>
                                <Tippy interactive content={item.title} offset={[0, 10]} placement="top">
                                    <div>
                                        <span className={cx('center-icon')}>{item.icon}</span>
                                    </div>
                                </Tippy>
                            </div>
                        ))}
                        <button className={cx('button-share')}>
                            <TippyHeadless offset={[-120, 15]} placement="bottom" interactive render={renderShareTippy}>
                                <span>
                                    <ShareFillIcon />
                                </span>
                            </TippyHeadless>
                        </button>
                    </div>
                </div>
                <div className={cx('copy-link-container')}>
                    <p className={cx('p-copy-link-text')}>{data?.file_url}</p>
                    <button className={cx('button-copy-link')}>Copy link</button>
                </div>
            </div>
        </div>
    );
};

ActionButtons.propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default memo(ActionButtons);
