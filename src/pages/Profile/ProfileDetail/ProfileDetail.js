import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { memo, useContext } from 'react';
import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';
import styles from './ProfileDetail.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { FollowingIcon, SettingIcon, ShareIcon } from '~/components/Icons';
import images from '~/assets/images';
import { ThemeContext } from '~/components/Context/ThemeProvider';

const cx = classNames.bind(styles);

function ProfileDetail({ data, isLoading }) {
    const themeContext = useContext(ThemeContext);

    const currentUser = false;
    const isFollowing = false;

    return (
        <div className={cx('profile')}>
            <Image
                key={data.avatar}
                className={cx('avatar')}
                src={
                    !isLoading
                        ? data.avatar || images.noImage
                        : themeContext.isDark
                          ? images.loadDark
                          : images.loadLight
                }
                alt={data?.nickname}
            />
            <div className={cx('info')}>
                <div className={cx('wrapper-name', { loading: isLoading })}>
                    {!isLoading && (
                        <>
                            <h1
                                className={cx('name', { check: data?.tick })}
                            >{`${data?.first_name || 'Not'} ${data?.last_name || 'found'}`}</h1>
                            {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                            <h2 className={cx('nickname')}>{data.nickname}</h2>
                        </>
                    )}
                </div>
                <div className={cx('wrapper-follow')}>
                    <div className={cx('info-follow', { loading: isLoading })}>
                        {!isLoading && (
                            <>
                                <div className={cx('follow-count')}>
                                    <strong>{data?.followings_count || 0}</strong>
                                    <span className={cx('follow')}>Following</span>
                                </div>
                                <div className={cx('follow-count')}>
                                    <strong>{data?.followers_count || 0}</strong>
                                    <span className={cx('follow')}>Followers</span>
                                </div>
                                <div className={cx('follow-count')}>
                                    <strong>{data?.likes_count || 0}</strong>
                                    <span className={cx('follow')}>Likes</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={cx('bio', { loading: isLoading })}>
                        {!isLoading && <h2 className={cx('bio-desc')}>{data.bio || 'No bio yet.'}</h2>}
                    </div>
                </div>
                <div className={cx('wrapper-button', { loading: isLoading })}>
                    {!isLoading && (
                        <>
                            {currentUser ? (
                                <Button primary className={cx('button')}>
                                    <span className={cx('title')}>Edit profile</span>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        primary
                                        className={cx('button', {
                                            'follow-button': true,
                                            following: isFollowing,
                                        })}
                                    >
                                        {isFollowing ? (
                                            <Tippy content={'Unfollow'} placement="bottom" offset={[0, 15]}>
                                                <div
                                                    className={cx('wrapper-icon', {
                                                        unfollow: isFollowing,
                                                    })}
                                                >
                                                    <FollowingIcon className={cx('follow-icon')} />
                                                    <span className={cx('title')}>Following</span>
                                                </div>
                                            </Tippy>
                                        ) : (
                                            <span className={cx('title')}>Follow</span>
                                        )}
                                    </Button>
                                    <Button
                                        className={cx('button', {
                                            'message-button': true,
                                        })}
                                    >
                                        <span className={cx('title')}>Message</span>
                                    </Button>
                                </>
                            )}
                            <Button
                                className={cx('button', {
                                    'setting-button': true,
                                })}
                            >
                                <SettingIcon width="1.9rem" height="1.9rem" />
                            </Button>
                            <Button
                                className={cx('button', {
                                    'share-button': true,
                                })}
                            >
                                <ShareIcon width="1.9rem" height="1.9rem" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

ProfileDetail.propTypes = {
    data: PropTypes.shape({
        avatar: PropTypes.string,
        nickname: PropTypes.string,
        tick: PropTypes.bool,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
    isLoading: PropTypes.bool,
};

export default memo(ProfileDetail);
