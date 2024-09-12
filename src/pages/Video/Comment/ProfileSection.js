import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import { EllipsisIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderTippy } from './TippyRenders';
import ContentSection from './ContentSection';
import ActionButtons from './ActionButtons';

const cx = classNames.bind(styles);

const ProfileSection = () => (
    <div className={cx('profile-wrapper')}>
        <div className={cx('desc-content-wrapper')}>
            <div className={cx('info-container')}>
                <Link className={cx('styled-link')}>
                    <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                        <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                            <Image src={images.avatar} className={cx('image-avatar')} />
                        </span>
                    </div>
                </Link>
                <Link className={cx('styled-link-styled-link')}>
                    <div className={cx('span-unique-id')}>
                        <span className={cx('span-ellipsis')}>mr.canh2639n</span>
                    </div>
                    <div className={cx('span-other-infos')}>
                        <span className={cx('ellipsis')}>nhin gi</span>
                        <span style={{ margin: '0 4px' }}>{' . '}</span>
                        <span>2024-12-12</span>
                    </div>
                </Link>
                <div>
                    <TippyHeadless
                        delay={[0, 200]}
                        offset={[-80, 8]}
                        placement="bottom"
                        render={renderTippy}
                        interactive
                    >
                        <span>
                            <EllipsisIcon style={{ width: 24, height: 24, cursor: 'pointer' }} />
                        </span>
                    </TippyHeadless>
                </div>
            </div>
            <ContentSection />
        </div>
        <ActionButtons />
    </div>
);

export default ProfileSection;
