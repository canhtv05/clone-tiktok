import classNames from 'classnames/bind';
import styles from './PageFeedEditPage.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import { useSelector } from 'react-redux';
import { ButtonFollowIcon, FullScreenIcon, MusicNoticeIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function PageFeedEditPage() {
    const currentUserImg = useSelector((state) => state.currentUserImage.currentUserImage);

    return (
        <div className={cx('container')}>
            <div className={cx('tiktok-frame')}>
                <div className={cx('bottom-navbar-container')}>
                    <Image src={images.bottomNavbarMobile} className={cx('bottom-navbar')} />
                </div>
            </div>
            <div style={{ height: '100%' }}>
                <div className={cx('video-player')}>
                    <div className={cx('video-player-container')}></div>
                    <div className={cx('mock-fullscreen-btn')}>
                        <FullScreenIcon />
                        <div className={cx('fullscreen-text')}>Fullscreen</div>
                    </div>
                    <div className={cx('video-player-control')}></div>
                </div>
            </div>
            <div className={cx('page-layout')}>
                <div className={cx('header-title')}>
                    <Image src={images.headerTitleMobile} className={cx('header-img')} />
                    <Image src={images.homeNavbarMobile} className={cx('header-img')} />
                </div>
                <div className={cx('video-overlay-container')}>
                    <div className={cx('sidebar-metadata-container')}>
                        <div className={cx('overlay-sidebar')}>
                            <div className={cx('avatar-container')}>
                                <Image src={currentUserImg} className={cx('avatar')} />
                                <ButtonFollowIcon className={cx('button-follow')} />
                            </div>
                            <Image src={images.interactionMobile} className={cx('interaction')} />
                            <div className={cx('music-cover-container')}></div>
                        </div>
                        <div className={cx('meta-data')}>
                            <div className={cx('user-name')}>rainrain9982</div>
                            <div className={cx('caption')}>Recording 2024-12-19 003029</div>
                            <div className={cx('sound-container')}>
                                <MusicNoticeIcon width="10px" height="10px" />
                                <div className={cx('sound')}>
                                    <div className={cx('marque')}>
                                        <p className={cx('p-marque')}>Original sound - rainrain9982</p>
                                        <p className={cx('p-marque')}>Original sound - rainrain9982</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageFeedEditPage;
