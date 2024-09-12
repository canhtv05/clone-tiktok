// src/components/Comment/ActionButtons.js
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import { HeartFillIcon, MessageFillIcon, FavoritesFillIcon, ShareFillIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { centerRowItems } from './MenuItem';
import { renderShareTippy } from './TippyRenders';
import Tippy from '@tippyjs/react';

const cx = classNames.bind(styles);

const ActionButtons = () => (
    <div className={cx('main-content')}>
        <div className={cx('main-content-wrapper')}>
            <div className={cx('flex-center-row')}>
                <div className={cx('center-row')}>
                    <div className={cx('wrapper-button-center-row')}>
                        <Button circle midIcon={<HeartFillIcon />} className={cx('button-icon')} />
                        <strong className={cx('strong-center-row')}>1</strong>
                    </div>
                    <div className={cx('wrapper-button-center-row')}>
                        <Button circle midIcon={<MessageFillIcon />} className={cx('button-icon')} />
                        <strong className={cx('strong-center-row')}>1</strong>
                    </div>
                    <div className={cx('wrapper-button-center-row')}>
                        <Button circle midIcon={<FavoritesFillIcon />} className={cx('button-icon')} />
                        <strong className={cx('strong-center-row')}>1</strong>
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
                <p className={cx('p-copy-link-text')}>
                    https://www.tiktok.com/@rainrain9982/video/7296850149144300818?is_from_webapp=1&sender_device=pc&web_id=7380842088713455112
                </p>
                <button className={cx('button-copy-link')}>Copy link</button>
            </div>
        </div>
    </div>
);

export default ActionButtons;
