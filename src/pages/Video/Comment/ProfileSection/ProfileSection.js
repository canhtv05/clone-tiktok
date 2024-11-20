import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfileSection.module.scss';
import Image from '~/components/Image';
import { EllipsisIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderTippy } from '../TippyRenders';
import ContentSection from '../ContentSection/ContentSection';
import ActionButtons from '../ActionButtons/ActionButtons';
import Button from '~/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';
import images from '~/assets/images';
import { setFollowingAUser } from '~/redux/slices/followingAUserSlice';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import { setIsFollowAUserByUserId } from '~/redux/slices/listVideosHomeSlice';
import ModalSuccess from '~/components/ModalSuccess';

const cx = classNames.bind(styles);

const ProfileSection = ({ data }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const followingUser = useSelector((state) => state.followingUser.followingUser);
    const [isShowModalError, setIsShowModalError] = useState(null);
    // lấy dữ liệu trước đó mà k cần setPrev
    // eslint-disable-next-line no-unused-vars
    const [prevFollowing, setPrevFollowing] = useState(followingUser);

    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (data?.user?.is_followed === undefined) return;
        dispatch(setFollowingAUser(data?.user?.is_followed));
        dispatch(setNickName(`@${data.user.nickname}`));
        dispatch(setIdUser(data.user.id));
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [data, dispatch]);

    useEffect(() => {
        if (isShowModalError) {
            const timer = setTimeout(() => {
                setPrevFollowing(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isShowModalError]);

    const handleFollow = useCallback(async () => {
        try {
            if (followingUser) {
                try {
                    dispatch(setFollowingAUser(false));
                    dispatch(setIsFollowAUserByUserId({ is_follow: false, user_id: data?.user?.id }));
                    await unfollowAUser(data?.user?.id, token);
                } catch (error) {
                    setIsShowModalError(true);
                }
            } else {
                try {
                    dispatch(setFollowingAUser(true));
                    dispatch(setIsFollowAUserByUserId({ is_follow: true, user_id: data?.user?.id }));
                    await followAUser(data?.user?.id, token);
                } catch (error) {
                    setIsShowModalError(true);
                }
            }
        } catch (error) {
            console.log(error);
            setIsShowModalError(true);
        }
    }, [data?.user?.id, followingUser, token, dispatch]);

    const renderPopper = useMemo(() => {
        if (!data?.user) {
            return;
        }
        return (
            <PopperWrapper>
                <AccountPreview
                    data={data?.user}
                    showBio
                    isFollowing={followingUser}
                    onClick={handleFollow}
                    isChange={prevFollowing !== followingUser}
                />
            </PopperWrapper>
        );
    }, [data?.user, handleFollow, followingUser, prevFollowing]);

    const handleNavigate = useCallback(() => {
        if (followingUser !== prevFollowing) {
            dispatch(setProfile({}));
        }
    }, [dispatch, followingUser, prevFollowing]);

    if (isLoading) {
        return (
            <div className={cx('profile-wrapper')}>
                <div className={cx('desc-content-wrapper')}>
                    <div className={cx('info-container')}>
                        <div className={cx('styled-link')}>
                            <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                    <div className={cx('image-avatar-loading')}></div>
                                </span>
                            </div>
                        </div>
                        <div className={cx('styled-link-styled-link', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('desc-main-content')}></div>
                </div>
                <div className={cx('main-content')}>
                    <div className={cx('main-content-wrapper')}>
                        <div className={cx('flex-center-row', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('copy-link-container')}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('profile-wrapper')}>
            <div className={cx('desc-content-wrapper')}>
                <div className={cx('info-container')}>
                    <span className="tippy">
                        <TippyHeadless render={() => renderPopper} interactive offset={[80, 20]} delay={[500, 300]}>
                            <Link
                                className={cx('wrapper-tippy')}
                                to={`/profile/@${data?.user?.nickname}`}
                                onClick={handleNavigate}
                            >
                                <div className={cx('styled-link')}>
                                    <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                        <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                            <Image
                                                src={data?.user?.avatar || images.noImage}
                                                className={cx('image-avatar')}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('styled-link-styled-link')}>
                                    <div className={cx('span-unique-id')}>
                                        <span className={cx('span-ellipsis')}>
                                            {`${data?.user?.first_name || ''} ${data?.user?.last_name || ''}`}
                                            {data?.user?.tick && (
                                                <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                            )}
                                        </span>
                                    </div>
                                    <div className={cx('span-other-infos')}>
                                        <span className={cx('ellipsis')}>{`${data?.user?.nickname || ''}`}</span>
                                        <span
                                            style={{ marginLeft: 8 }}
                                        >{`${data?.published_at?.split(' ')[0] || ''}`}</span>
                                    </div>
                                </div>
                            </Link>
                        </TippyHeadless>
                    </span>
                    {currentUser === data?.user_id ? (
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
                    ) : (
                        <div>
                            <Button
                                onClick={handleFollow}
                                className={cx('button-follow', { following: followingUser })}
                                primary
                                outline={followingUser}
                            >
                                {followingUser ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    )}
                </div>
                <ContentSection data={data} />
            </div>
            <ActionButtons data={data} />
            {isShowModalError && <ModalSuccess title="An error occurred. Please try again." />}
        </div>
    );
};

ProfileSection.propTypes = {
    data: PropTypes.object,
};

export default memo(ProfileSection);
