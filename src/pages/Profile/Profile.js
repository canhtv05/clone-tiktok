import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import images from '~/assets/images';
import { LockIcon, SettingIcon, ShareIcon } from '~/components/Icons';
import { useMemo, useState } from 'react';

const cx = classNames.bind(styles);

function Profile() {
    const [typeMenu, setTypeMenu] = useState('videos');

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('profile')}>
                <Image className={cx('avatar')} src={images.avatar} />
                <div className={cx('info')}>
                    <div className={cx('wrapper-name')}>
                        <h1 className={cx('name')}>mrrain_1710</h1>
                        <h2 className={cx('nickname')}>rain1710</h2>
                    </div>
                    <div className={cx('wrapper-follow')}>
                        <div className={cx('info-follow')}>
                            <div className={cx('follow-count')}>
                                <strong>0</strong>
                                <span className={cx('follow')}>Following</span>
                            </div>
                            <div className={cx('follow-count')}>
                                <strong>2</strong>
                                <span className={cx('follow')}>Followers</span>
                            </div>
                            <div className={cx('follow-count')}>
                                <strong>3</strong>
                                <span className={cx('follow')}>Likes</span>
                            </div>
                        </div>
                        <div className={cx('bio')}>
                            <h2 className={cx('bio-desc')}>No bio yet.</h2>
                        </div>
                    </div>
                    <div className={cx('wrapper-button')}>
                        <Button primary className={cx('button')}>
                            <span className={cx('title')}>Edit profile</span>
                        </Button>
                        <Button className={cx('button', { 'setting-button': true })}>
                            <SettingIcon width="1.9rem" height="1.9rem" />
                        </Button>
                        <Button className={cx('button', { 'share-button': true })}>
                            <ShareIcon width="1.9rem" height="1.9rem" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('nav-menu')}>
                    <Button
                        className={cx('nav-button', { active: typeMenu === 'videos' })}
                        onClick={() => handleSelectedMenu('videos')}
                    >
                        <span className={cx('title')}>Videos</span>
                    </Button>
                    <Button
                        leftIcon={<LockIcon />}
                        className={cx('nav-button', { active: typeMenu === 'favorites' })}
                        onClick={() => handleSelectedMenu('favorites')}
                    >
                        <span className={cx('title')}>Favorites</span>
                    </Button>
                    <Button
                        leftIcon={<LockIcon />}
                        className={cx('nav-button', { active: typeMenu === 'liked' })}
                        onClick={() => handleSelectedMenu('liked')}
                    >
                        <span className={cx('title')}>Liked</span>
                    </Button>
                    <div className={cx('tab-line')}></div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
