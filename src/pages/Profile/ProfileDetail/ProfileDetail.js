import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';
import styles from './ProfileDetail.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { FollowingIcon, SettingIcon, ShareIcon } from '~/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { unfollowAUser } from '~/services/follow/unfollowAUser';
import { followAUser } from '~/services/follow/followAUser';
import { setFollowingAUser } from '~/redux/slices/followingAUserSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '~/components/LoginForm';
import { setProfile } from '~/redux/slices/profileSlice';
import ModalEditProfile from '../ModalEditProfile';

const cx = classNames.bind(styles);

function ProfileDetail({ isLoading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const data = useSelector((state) => state.profile.data);

    const [isFollowing, setIsFollowing] = useState(data?.is_followed);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);

    const followingAUser = useSelector((state) => state.followingUser.followingUser);
    const userNickName = useSelector((state) => state.currentUser.currentUser);
    const avatar = useSelector((state) => state.currentUserImage.currentUserImage);
    const user = useSelector((state) => state.currentUser.currentUser);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if ((!data || Object.keys(data).length === 0) && isLoading) return;
        if (!isLoading && Object.keys(data).length !== 0 && data) {
            setIsFollowing(data.is_followed);
            dispatch(setFollowingAUser(data.is_followed));
        }
    }, [data, isLoading, dispatch]);

    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const myProfile = useSelector((state) => state.myAccount.myAccount);
    const { fullNameCurrentUser } = useSelector((state) => state.fullNameCurrentUser);
    const { bio } = useSelector((state) => state.infoCurrentUser.infoCurrentUser);

    useEffect(() => {
        if (followingAUser) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }
    }, [followingAUser]);

    const handleFollow = useCallback(async () => {
        if (!token) {
            setIsShowModalLogin(true);
            return;
        }
        let isFollow;
        if (isFollowing && data.id) {
            setIsFollowing(false);
            isFollow = false;
            await unfollowAUser(data.id, token);
        } else {
            setIsFollowing(true);
            isFollow = true;
            await followAUser(data.id, token);
        }

        const newProfile = {
            ...data,
            is_followed: isFollow,
        };

        dispatch(setProfile(newProfile));
    }, [isFollowing, data, token, dispatch]);

    const handleToMessage = useCallback(() => {
        if (!token && !user) {
            setIsShowModalLogin(true);
            return;
        }
        const date = new Date();
        let hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0');

        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        const formatTime = `${hour}:${minute} ${ampm}`;

        if (Object.keys(data).length !== 0) {
            const check = localStorage.getItem('list-message');
            let listMessage = check ? JSON.parse(check) : [];

            const lastId = listMessage.length > 0 ? listMessage[listMessage.length - 1].user.id : 0;
            const newId = lastId + 1;

            const currentProfile = {
                user: {
                    nickname: data?.nickname,
                    full_name: `${data?.first_name} ${data?.last_name}`,
                    avatar: data?.avatar,
                    time: formatTime,
                    content_user: `Chỉ là fake message thôi :))`,
                    tick: data?.tick,
                    is_muted: false,
                    id: newId,
                    is_online: Math.round(Math.random()),
                    isMe: false,
                },
                me: {
                    id: newId,
                    time: formatTime,
                    nickname: userNickName,
                    avatar: avatar,
                    content_me: ['Copyright by Canhtv05'],
                    isMe: true,
                },
            };

            const findDuplicate = listMessage.find((item) => item.user.nickname === currentProfile.user.nickname);
            if (!findDuplicate) {
                listMessage.unshift(currentProfile);
            }

            localStorage.setItem('list-message', JSON.stringify(listMessage));
            navigate('/messages', { state: { background: location } });
        }
    }, [navigate, data, avatar, userNickName, token, user, location]);

    const handleShowModalEdit = () => {
        setIsShowModalEdit(true);
    };

    return (
        <div className={cx('profile')}>
            {isLoading && Object.keys(data).length === 0 ? (
                <div className={cx('loading-avatar', { load: isLoading })}></div>
            ) : (
                <Image key={data?.avatar} className={cx('avatar')} src={data?.avatar} alt={data?.nickname} />
            )}
            <div className={cx('info')}>
                <div className={cx('wrapper-name', { loading: isLoading })}>
                    {!isLoading && Object.keys(data).length !== 0 && (
                        <>
                            <h1
                                className={cx('name', {
                                    check: data?.tick,
                                    'has-full-name': data?.first_name || data?.last_name,
                                })}
                            >
                                {myProfile ? fullNameCurrentUser : `${data?.first_name || ''} ${data?.last_name || ''}`}
                            </h1>
                            {data?.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                            <h2 className={cx('nickname')}>{data?.nickname || ''}</h2>
                        </>
                    )}
                </div>
                <div className={cx('wrapper-follow')}>
                    <div className={cx('info-follow', { loading: isLoading })}>
                        {!isLoading && Object.keys(data).length !== 0 && (
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
                        {!isLoading && Object.keys(data).length !== 0 && (
                            <h2 className={cx('bio-desc')}>
                                {myProfile ? bio || 'No bio yet.' : data?.bio || 'No bio yet.'}
                            </h2>
                        )}
                    </div>
                </div>
                <div className={cx('wrapper-button', { loading: isLoading })}>
                    {!isLoading && Object.keys(data).length !== 0 && (
                        <>
                            {currentUser && myProfile && !isLoading ? (
                                <>
                                    <Button primary className={cx('button')} onClick={handleShowModalEdit}>
                                        <span className={cx('title')}>Edit profile</span>
                                    </Button>
                                    <Button className={cx('button', { promote: true })}>
                                        <span className={cx('title', { 'promote-title': true })}>Promote post</span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        primary
                                        className={cx('button', {
                                            'follow-button': true,
                                            following: isFollowing,
                                        })}
                                        onClick={handleFollow}
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
                                        onClick={handleToMessage}
                                        className={cx('button', {
                                            'message-button': true,
                                        })}
                                    >
                                        <span className={cx('title')}>Message</span>
                                    </Button>
                                </>
                            )}
                            {currentUser && myProfile && !isLoading && (
                                <Button
                                    className={cx('button', {
                                        'setting-button': true,
                                    })}
                                >
                                    <SettingIcon width="1.9rem" height="1.9rem" />
                                </Button>
                            )}
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
            <LoginModal isShowModalLoginForm={isShowModalLogin} setIsShowModalLoginForm={setIsShowModalLogin} />
            <ModalEditProfile isShowModal={isShowModalEdit} setIsShowModal={setIsShowModalEdit} />
        </div>
    );
}

ProfileDetail.propTypes = {
    isLoading: PropTypes.bool,
};

export default memo(ProfileDetail);
